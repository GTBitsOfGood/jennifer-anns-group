import { HTTP_STATUS_CODE } from "../consts";

export abstract class AdminException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class DeletePermanentAdminEmailException extends AdminException {
  constructor(message = "Permanent admins cannot be deleted") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class AdminDoesNotExistException extends AdminException {
  constructor(message = "Admin does not exist") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class AdminAlreadyExistsException extends AdminException {
  constructor(message = "Admin already exists") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class AdminInvalidInputException extends AdminException {
  constructor(message = "Invalid admin input") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}
