declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    B2_APPLICATION_KEY_ID: string;
    B2_APPLICATION_KEY: string;
    B2_BUCKET_ID: string;
  }
}
