import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import UserModel from '../../sequelize/models/user.model';
import { ErrorNames } from '../../types/errors.type';
import { nextErrorByName } from './errorHandler';

export const userExtractor = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.token) {
    return next(nextErrorByName(ErrorNames.JsonWebTokenError));
  }

  const decodedToken = jwt.verify(req.token, constants.JWT_SECRET);

  if (typeof decodedToken !== 'string') {
    req.user = await UserModel.findOne({ where: { username: decodedToken.username } });
  }

  if (!req.user) {
    return next(nextErrorByName(ErrorNames.Unauthorized));
  }

  next();
});

export default userExtractor;
