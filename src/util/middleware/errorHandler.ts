import { NextFunction, Request, Response } from 'express';
import { ErrorNames, ErrorResponse, StatusCodes } from '../../types/errors.type';
import { parseError, serializeError } from '../../types/utils/parsers/error.parser';

const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  let response: Error = {
    message: 'Something broke!',
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    name: ErrorNames.Error,
  };

  response = serializeError(parseError(error)) || response;

  if (error instanceof Error) {
    switch (error.name) {
      case ErrorNames.NotFound:
        response.message = 'The requested resource doesn’t exists!';
        response.status = StatusCodes.NOT_FOUND;
        break;
      case ErrorNames.CastError:
        response.message = 'Malformatted id!';
        response.status = StatusCodes.BAD_REQUEST;
        break;
      case ErrorNames.ValidationError:
        response.message = 'Validation failed!';
        response.status = StatusCodes.BAD_REQUEST;
        break;
      case ErrorNames.SequelizeValidationError:
        response.message = 'Validation failed!';
        response.status = StatusCodes.BAD_REQUEST;
        break;
      case ErrorNames.JsonWebTokenError:
        response.message = 'Invalid token!';
        response.status = StatusCodes.UNAUTHORIZED;
        break;
      case ErrorNames.TokenExpiredError:
        response.message = 'Token expired!';
        response.status = StatusCodes.UNAUTHORIZED;
        break;
      case ErrorNames.Unauthorized:
        response.message = 'User doesn’t have permissions to perform this action.';
        response.status = StatusCodes.UNAUTHORIZED;
        break;
      case ErrorNames.NotInTestMode:
        response.message = 'Access denied! App is not running in test-mode!';
        response.status = StatusCodes.UNAUTHORIZED;
        break;
      default:
        response = {
          ...response,
          ...error,
        };
    }
  }

  const errorResponse: ErrorResponse = { error: response };

  res.status(response?.status || StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
};

export default errorHandler;
