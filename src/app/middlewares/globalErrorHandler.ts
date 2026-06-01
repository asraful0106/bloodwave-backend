import type { NextFunction, Request, Response } from "express";
import type { TErrorSourch } from "../interfaces/error.types.js";
import { handleDuplicateError } from "../helpers/handleDuplicateError.js";
import { handleCastError } from "../helpers/handleCastErrors.js";
import { handleZoodError } from "../helpers/handleZoodError.js";
import { handleValidationError } from "../helpers/handleValidationError.js";
import AppError from "../errorHelper/AppError.js";
import { envVars } from "../config/envVars.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "Development") {
    // eslint-disable-next-line no-console
    console.log(err);
  }

  let errorSources: TErrorSourch[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";

  //Duplicate error
  if (err.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  }
  // Object ID error / Cast Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
  } else if (err.name === "ZodError") {
    const simplifiedError = handleZoodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources as TErrorSourch[];
  }
  //Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSources = simplifiedError.errorSources as TErrorSourch[];
    message = simplifiedError.message;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: envVars.NODE_ENV === "Development" ? err : null,
    stack: envVars.NODE_ENV === "Development" ? err.stack : null,
  });
};
