import { HTTP_STATUS_CODE } from "../consts";

export abstract class EmailException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class EmailInvalidInputException extends EmailException {
  constructor(message = "Invalid email input") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class EmailFailedToSendException extends EmailException {
  constructor(message = "Email failed to send") {
    super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
