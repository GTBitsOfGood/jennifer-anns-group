import { HTTP_STATUS_CODE } from "../consts";

export abstract class UserException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class UserAlreadyExistsException extends UserException {
  constructor(message = "User already exists") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class UserDoesNotExistException extends UserException {
  constructor(message = "User does not exist") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class UserCredentialsIncorrectException extends UserException {
  constructor(message = "Incorrect credentials") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}
export class GenericUserErrorException extends UserException {
  constructor(message = "An error has occurred") {
    super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}
