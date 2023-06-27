import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../../types/errors.type';

const unknownEndpoint = (_req: Request, _res: Response, next: NextFunction) => {
  const error = new Error('Unknown endpoint!');
  error.status = StatusCodes.NOT_FOUND;
  next(error);
};

export default unknownEndpoint;
