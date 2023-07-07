import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from '../../types/errors.type';
import { getError } from './errorHandler';

const unknownEndpoint = (_req: Request, _res: Response, next: NextFunction) => {
  next(getError({ message: 'Unknown endpoint!', status: StatusCodes.NOT_FOUND }));
};

export default unknownEndpoint;
