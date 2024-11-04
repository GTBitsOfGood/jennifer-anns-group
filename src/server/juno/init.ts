import juno from "juno-sdk";

juno.init({
  apiKey: process.env.JUNO_API_KEY ?? "",
  baseURL:
    "https://api-gateway.whitesmoke-cea9a269.eastus.azurecontainerapps.io/",
});

const junoEmailClient = juno.email;
export { junoEmailClient };
