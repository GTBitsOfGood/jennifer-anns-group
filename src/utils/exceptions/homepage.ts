import { HTTP_STATUS_CODE } from "../consts";

export abstract class HomePageException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class HomePageInvalidInputException extends HomePageException {
  constructor(message = "Invalid home page input") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class HomePageDoesNotExistException extends HomePageException {
  constructor(message = "Home page does not exist") {
    super(message, HTTP_STATUS_CODE.NOT_FOUND);
  }
}
