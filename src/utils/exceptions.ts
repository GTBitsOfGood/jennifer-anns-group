export class UserAlreadyExistsException extends Error {
  constructor(message = "User already exists") {
    super(message);
  }
}

export class UserDoesNotExistException extends Error {
  constructor(message = "User does not exist") {
    super(message);
  }
}

export class UserCredentialsIncorrectException extends Error {
  constructor(message = "Incorrect credentials") {
    super(message);
  }
}

export class GenericServerErrorException extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
  }
}
