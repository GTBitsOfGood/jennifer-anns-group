//
// Proxy Backblaze S3 compatible API requests, sending notifications to a webhook
//
// Adapted from https://github.com/obezuk/worker-signed-s3-template
//
import { AwsClient } from "aws4fetch";

const UNSIGNABLE_HEADERS = [
  // These headers appear in the request, but are not passed upstream
  "x-forwarded-proto",
  "x-real-ip",
  // We can't include accept-encoding in the signature because Cloudflare
  // sets the incoming accept-encoding header to "gzip, br", then modifies
  // the outgoing request to set accept-encoding to "gzip".
  // Not cool, Cloudflare!
  "accept-encoding",
];

// URL needs colon suffix on protocol, and port as a string
const HTTPS_PROTOCOL = "https:";
const HTTPS_PORT = "443";

// How many times to retry a range request where the response is missing content-range
const RANGE_RETRY_ATTEMPTS = 3;

// Filter out cf-* and any other headers we don't want to include in the signature
function filterHeaders(headers, env) {
  return new Headers(
    Array.from(headers.entries()).filter(
      (pair) =>
        !UNSIGNABLE_HEADERS.includes(pair[0]) &&
        !pair[0].startsWith("cf-") &&
        !("ALLOWED_HEADERS" in env && !env.ALLOWED_HEADERS.includes(pair[0])),
    ),
  );
}

const exported = {
  async fetch(request, env) {
    // Only allow GET and HEAD methods
    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response(null, {
        status: 405,
        statusText: "Method Not Allowed",
      });
    }

    const url = new URL(request.url);

    // Incoming protocol and port is taken from the worker's environment.
    // Local dev mode uses plain http on 8787, and it's possible to deploy
    // a worker on plain http. B2 only supports https on 443
    url.protocol = HTTPS_PROTOCOL;
    url.port = HTTPS_PORT;

    // Remove leading slashes from path
    let path = url.pathname.replace(/^\//, "");
    // Remove trailing slashes
    path = path.replace(/\/$/, "");
    // Split the path into segments
    const pathSegments = path.split("/");

    if (env.ALLOW_LIST_BUCKET !== "true") {
      // Don't allow list bucket requests
      if (
        (env.BUCKET_NAME === "$path" && pathSegments.length < 2) || // https://endpoint/bucket-name/
        (env.BUCKET_NAME !== "$path" && path.length === 0)
      ) {
        // https://bucket-name.endpoint/ or https://endpoint/
        return new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      }
    }

    // Set upstream target hostname.
    switch (env.BUCKET_NAME) {
      case "$path":
        // Bucket name is initial segment of URL path
        url.hostname = env.B2_ENDPOINT;
        break;
      case "$host":
        // Bucket name is initial subdomain of the incoming hostname
        url.hostname = url.hostname.split(".")[0] + "." + env.B2_ENDPOINT;
        break;
      default:
        // Bucket name is specified in the BUCKET_NAME variable
        url.hostname = env.BUCKET_NAME + "." + env.B2_ENDPOINT;
        break;
    }

    // Certain headers, such as x-real-ip, appear in the incoming request but
    // are removed from the outgoing request. If they are in the outgoing
    // signed headers, B2 can't validate the signature.
    const headers = filterHeaders(request.headers, env);

    // Extract the region from the endpoint
    const endpointRegex = /^s3\.([a-zA-Z0-9-]+)\.backblazeb2\.com$/;
    const [, aws_region] = env.B2_ENDPOINT.match(endpointRegex);

    // Create an S3 API client that can sign the outgoing request
    const client = new AwsClient({
      accessKeyId: env.B2_APPLICATION_KEY_ID,
      secretAccessKey: env.B2_APPLICATION_KEY,
      service: "s3",
      region: aws_region,
    });

    // Sign the outgoing request
    const signedRequest = await client.sign(url.toString(), {
      method: request.method,
      headers: headers,
    });

    // For large files, Cloudflare will return the entire file, rather than the requested range
    // So, if there is a range header in the request, check that the response contains the
    // content-range header. If not, abort the request and try again.
    // See https://community.cloudflare.com/t/cloudflare-worker-fetch-ignores-byte-request-range-on-initial-request/395047/4
    if (signedRequest.headers.has("range")) {
      let attempts = RANGE_RETRY_ATTEMPTS;
      let response;
      do {
        let controller = new AbortController();
        response = await fetch(signedRequest.url, {
          method: signedRequest.method,
          headers: signedRequest.headers,
          signal: controller.signal,
        });
        if (response.headers.has("content-range")) {
          // Only log if it didn't work first time
          if (attempts < RANGE_RETRY_ATTEMPTS) {
            console.log(
              `Retry for ${signedRequest.url} succeeded - response has content-range header`,
            );
          }
          // Break out of loop and return the response
          break;
        } else if (response.ok) {
          attempts -= 1;
          console.error(
            `Range header in request for ${signedRequest.url} but no content-range header in response. Will retry ${attempts} more times`,
          );
          // Do not abort on the last attempt, as we want to return the response
          if (attempts > 0) {
            controller.abort();
          }
        } else {
          // Response is not ok, so don't retry
          break;
        }
      } while (attempts > 0);

      if (attempts <= 0) {
        console.error(
          `Tried range request for ${signedRequest.url} ${RANGE_RETRY_ATTEMPTS} times, but no content-range in response.`,
        );
      }

      // Return whatever response we have rather than an error response
      // This response cannot be aborted, otherwise it will raise an exception
      return response;
    }

    // Send the signed request to B2, returning the upstream response
    const response = await fetch(signedRequest);
    let newHeaders = new Headers(response.headers);

    // get origin url
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      "http://localhost:3000",
      "https://jennifer-anns.netlify.app",
      "https://main--jennifer-anns.netlify.app",
    ];

    if (allowedOrigins.includes(origin)) {
      newHeaders.set("Access-Control-Allow-Origin", origin);
    }
    newHeaders.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "*");

    // Create a new response with the new headers
    let newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

    return newResponse;
  },
};
export default exported;
