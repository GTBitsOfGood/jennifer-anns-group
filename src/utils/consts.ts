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
  EDITGAME = "/games/[id]/edit",
  ACCOUNTMANAGEMENT = "/admin/account-management",
  THEMES = "/admin/themes",
}

export const ADMIN_CONTACT = "contact@jenniferann.org";

export const CLOUDFLARE_URL =
  "https://cloudflare-b2.bogjenniferanns.workers.dev";

export const UNDELETABLE_EMAILS = [
  "drew@jenniferann.org",
  "susanne@jenniferann.org",
];
export const DEV_ADMIN_CONTACT = "bogjenniferanns@gmail.com";

export const MAIL_SEND_DOMAIN = "trial-z86org8kpm1gew13.mlsender.net";
