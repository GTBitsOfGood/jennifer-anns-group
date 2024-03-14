declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    B2_APPLICATION_KEY_ID: string;
    B2_APPLICATION_KEY: string;
    B2_BUCKET_ID_BUILD: string;
    B2_BUCKET_ID_APPLICATION: string;
  }
}
