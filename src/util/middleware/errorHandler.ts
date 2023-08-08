import { NextFunction, Request, Response } from 'express';
import { ErrorNames, StatusCodes } from '../../types/errors.type';

const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let response: Error = {
    message: 'Something broke!',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    name: ErrorNames.Error,
  };

  if (error instanceof Error) {
    switch (error.name) {
      case ErrorNames.NotFound:
        response = {
          message: 'The requested resource doesn’t exists!',
          status: StatusCodes.NOT_FOUND,
          name: ErrorNames.NotFound,
        };
        break;
      case ErrorNames.CastError:
        response = {
          message: 'Malformatted id!',
          status: StatusCodes.BAD_REQUEST,
          name: ErrorNames.CastError,
        };
        break;
      case ErrorNames.ValidationError:
        response = {
          message: 'Validation failed!',
          status: StatusCodes.BAD_REQUEST,
          name: ErrorNames.ValidationError,
        };
        break;
      case ErrorNames.JsonWebTokenError:
        response = {
          message: 'Invalid token!',
          status: StatusCodes.UNAUTHORIZED,
          name: ErrorNames.JsonWebTokenError,
        };
        break;
      case ErrorNames.TokenExpiredError:
        response = {
          message: 'Token expired!',
          status: StatusCodes.UNAUTHORIZED,
          name: ErrorNames.TokenExpiredError,
        };
        break;
      case ErrorNames.Unauthorized:
        response = {
          message: 'User doesn’t have permissions to perform this action.',
          status: StatusCodes.UNAUTHORIZED,
          name: ErrorNames.Unauthorized,
        };
        break;
      case ErrorNames.NotInTestMode:
        response = {
          message: 'Access denied! App is not running in test-mode!',
          status: StatusCodes.UNAUTHORIZED,
          name: ErrorNames.NotInTestMode,
        };
        break;
      default:
        response = {
          ...response,
          ...error,
        };
    }
  }

  res.status(response?.status || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: response });
};

export default errorHandler;
