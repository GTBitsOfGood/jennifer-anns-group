export const HTTP_BAD_REQUEST = 400;
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_UNAUTHORIZED = 401;
export const HTTP_FORBIDDEN = 403;
export const HTTP_NOT_FOUND = 404;
export const HTTP_METHOD_NOT_ALLOWED = 405;
export const HTTP_INTERNAL_SERVER_ERROR = 500;

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
  CREATEGAME = "/admin/create-game",
}
