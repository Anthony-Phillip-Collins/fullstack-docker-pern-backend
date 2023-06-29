import { NextFunction, Request, Response } from 'express';
import { ErrorNames, ErrorResponse, StatusCodes } from '../../types/errors.type';

export const errorResponse = (message: string): ErrorResponse => {
  return { error: { message } };
};

export const nextError = (message: string, status: StatusCodes): Error => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let message = 'Something broke!';
  let status = StatusCodes.INTERNAL_SERVER_ERROR;
  if (error instanceof Error) {
    switch (error.name) {
      case ErrorNames.NotFound:
        message = 'The requested resource doesn’t exists!';
        status = StatusCodes.NOT_FOUND;
        break;
      case ErrorNames.CastError:
        message = 'Malformatted id!';
        status = StatusCodes.BAD_REQUEST;
        break;
      case ErrorNames.ValidationError:
        message = 'Validation failed!';
        status = StatusCodes.BAD_REQUEST;
        break;
      case ErrorNames.JsonWebTokenError:
        message = 'Token missing or invalid!';
        status = StatusCodes.UNAUTHORIZED;
        break;
      case ErrorNames.Unauthorized:
        message = 'User doesn’t have permissions to perform this action.';
        status = StatusCodes.UNAUTHORIZED;
        break;
      case ErrorNames.NotInTestMode:
        message = 'Access denied! App is not running in test-mode!';
        status = StatusCodes.UNAUTHORIZED;
        break;
      default:
        message = error.message || 'Something broke!';
        status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    }
  }

  res.status(status).send(errorResponse(message));
};

export default errorHandler;
