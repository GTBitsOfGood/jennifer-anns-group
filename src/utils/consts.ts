export enum HTTP_STATUS_CODE {
  BAD_REQUEST = 400,
  OK = 200,
  CREATED = 201,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Pages {
  HOME = "/",
  LOGIN = "/login",
  SIGNUP = "/signup",
  CREATEGAME = "/games/create",
}

export const ADMIN_CONTACT = "contact@jenniferann.org";

export const CLOUDFLARE_URL =
  "https://cloudflare-b2.bogjenniferanns.workers.dev";
