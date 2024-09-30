import { HTTP_STATUS_CODE } from "../consts";

export abstract class VerificationLogException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class VerificationLogDoesNotExistException extends VerificationLogException {
  constructor(message = "Verification log does not exist") {
    super(message, HTTP_STATUS_CODE.NOT_FOUND);
  }
}
