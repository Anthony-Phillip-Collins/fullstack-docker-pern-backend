export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
}

export enum ErrorNames {
  Error = 'Error',
  NotFound = 'NotFound',
  CastError = 'CastError',
  ValidationError = 'ValidationError',
  JsonWebTokenError = 'JsonWebTokenError',
  Unauthorized = 'Unauthorized',
  NotInTestMode = 'NotInTestMode',
}

export interface ErrorResponse {
  error: { message: string };
}
