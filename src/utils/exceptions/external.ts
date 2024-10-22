import { HTTP_STATUS_CODE } from "../consts";

export abstract class ExternalException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class InvalidAPIException extends ExternalException {
  constructor(message = "Invalid API Key used.") {
    super(message, HTTP_STATUS_CODE.FORBIDDEN);
  }
}
