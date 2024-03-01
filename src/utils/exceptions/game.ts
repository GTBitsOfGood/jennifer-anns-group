import { HTTP_STATUS_CODE } from "../consts";

export abstract class GameException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class GameInvalidInputException extends GameException {
  constructor(message = "Invalid game input") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class GameNotFoundException extends GameException {
  constructor(message = "Game does not exist") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class GenericGameErrorException extends GameException {
  constructor(message = "An error has occurred") {
    super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

export class InvalidIdGameErrorException extends GameException {
  constructor(message = "Invalid ObjectID in game endpoint") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class GameAlreadyExistsException extends GameException {
  constructor(message = "Game already exists") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class BuildUploadException extends GameException {
  constructor(message = "Failed to generate build URL and auth token") {
    super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

export class BuildNotFoundException extends GameException {
  constructor(message = "Build does not exist") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}
