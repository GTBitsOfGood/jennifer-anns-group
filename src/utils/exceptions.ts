import { MongoServerError } from "mongodb";
import { NextApiResponse } from "next";
import { ZodError } from "zod";
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
export class GenericUserErrorException extends Error {
  constructor(message = "User Error") {
    super(message);
  }
}
export class AbstractGameErrorException extends Error {
  constructor(message = "User mistake in game endpoint") {
    super(message);
    if (this.constructor === AbstractGameErrorException) {
      throw new TypeError("Abstract class cannot be instantiated"); //Ensures constructor gets overrided.
    }
  }
}
export class InvalidIdGameErrorException extends Error {
  constructor(message = "Invalid ObjectID in game endpoint") {
    super(message);
  }
}
export class InvalidThemeErrorException extends Error {
  constructor(message = "Invalid Theme name in game endpoint") {
    super(message);
  }
}
export class InvalidTagErrorException extends Error {
  constructor(message = "Invalid Tag name in game endpoint") {
    super(message);
  }
}

export class GenericServerErrorException extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
  }
}

export function customErrorHandler(res: NextApiResponse, error: unknown) {
  if (error instanceof Error) {
    if (error instanceof ZodError) {
      return res.status(400).send({
        error: JSON.parse(error.message),
      });
    } else if (
      error instanceof GenericUserErrorException ||
      error instanceof AbstractGameErrorException
    ) {
      return res.status(400).send({
        error: error.message,
      });
    } else if (error instanceof SyntaxError) {
      return res.status(400).send({
        message:
          "SyntaxError: You may potentially be sending JSON, instead of text.",
      });
    } else if (
      error.hasOwnProperty("code") && //Tried to use instanceof MongoServerError, but that fails to catch MongoServerError
      (error as MongoServerError).code == 11000
    ) {
      return res.status(400).send({
        message: error.message,
      });
    } else {
      return res.status(500).send({
        error: error.message,
      });
    }
  } else {
    //Non-error thrown in this case, don't know what to do
    console.log(error);
    return res.status(500).send("Unknown issue occured.");
  }
}
//Creare an API endpoint exception wrapper class here. Thus I won't need to import errors.
