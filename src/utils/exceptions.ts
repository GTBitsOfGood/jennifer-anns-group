import { MongoServerError } from "mongodb";
import { NextApiResponse } from "next";
import { ZodError } from "zod";
import { HTTP_STATUS_CODE } from "./consts";

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
export class GenericServerErrorException extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
  }
}

export abstract class ThemeException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class ThemeInvalidInputException extends ThemeException {
  constructor(message = "Invalid theme input") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class ThemeNotFoundException extends ThemeException {
  constructor(message = "Theme does not exist") {
    super(message, HTTP_STATUS_CODE.BAD_REQUEST);
  }
}

export class GenericThemeErrorException extends ThemeException {
  constructor(message = "An error has occurred") {
    super(message, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
}

export function customErrorHandler(res: NextApiResponse, error: unknown) {
  if (error instanceof Error) {
    if (error instanceof ZodError) {
      return res.status(400).send({
        error: JSON.parse(error.message),
      });
    } else if (error instanceof GenericUserErrorException) {
      return res.status(400).send({
        error: error.message,
      });
    } else if (error instanceof SyntaxError) {
      return res.status(400).send({
        message: "SyntaxError: Ensure you are sending text, not a JSON.",
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
