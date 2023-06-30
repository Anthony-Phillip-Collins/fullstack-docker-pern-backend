import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import UserModel from '../../sequelize/models/user.model';
import { nextError } from './errorHandler';
import { StatusCodes } from '../../types/errors.type';

export const userExtractor = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.token) {
    const error = nextError('Token is missing!', StatusCodes.UNAUTHORIZED);
    return next(error);
  }

  const decodedToken = jwt.verify(req.token, constants.JWT_SECRET);

  if (typeof decodedToken !== 'string') {
    req.user = await UserModel.findOne({ where: { username: decodedToken.username } });
  }

  if (!req.user) {
    const error = nextError('User not found!', StatusCodes.UNAUTHORIZED);
    return next(error);
  }

  next();
});

export default userExtractor;
