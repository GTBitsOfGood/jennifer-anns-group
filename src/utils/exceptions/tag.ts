import { HTTP_STATUS_CODE } from "../consts";

export abstract class TagException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class TagInvalidInputException extends TagException {
  constructor(message = "Invalid tag input") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class TagNotFoundException extends TagException {
  constructor(message = "Tag does not exist") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class GenericTagErrorException extends TagException {
  constructor(message = "An error has occurred") {
    super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
