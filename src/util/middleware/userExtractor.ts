import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import constants from '../../constants';
import userService from '../../sequelize/services/user.service';
import { ErrorNames, StatusCodes } from '../../types/errors.type';
import { getError } from './errorHandler';
import routes from '../../controllers';

const extract = (adminOnly?: boolean) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.token) {
      return next(getError(ErrorNames.JsonWebTokenError));
    }

    const decodedToken = jwt.verify(req.token, constants.JWT_SECRET);

    if (typeof decodedToken !== 'string') {
      req.user = await userService.getByUsername(decodedToken.username);
    }

    if (req.user) {
      const { id, username } = req.params;
      const isUserRoute = req.originalUrl.includes(routes.paths.users);
      const isSingleUserRoute = isUserRoute && (id || username);

      if (req.user.disabled) {
        return next(getError({ message: 'User is disabled!', status: StatusCodes.UNAUTHORIZED }));
      }

      if (!req.user.admin && adminOnly) {
        return next(getError({ message: 'User is not admin!', status: StatusCodes.UNAUTHORIZED }));
      }

      if (isSingleUserRoute) {
        const userMatchesSingleRoute =
          (id && req.user.id === Number(id)) || (username && req.user.username === username);

        if (!req.user.admin && !userMatchesSingleRoute) {
          return next(getError(ErrorNames.Unauthorized));
        }

        req.userOfSingleRoute = req.user.username === username ? req.user : await userService.getByUsername(username);
      }
    } else {
      return next(getError(ErrorNames.Unauthorized));
    }

    next();
  });

export const userExtractor = extract();

export const adminExtractor = extract(true);
