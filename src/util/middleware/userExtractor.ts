import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import routes from '../../controllers';
import userService from '../../sequelize/services/user.service';
import tokenizer from '../../sequelize/util/tokenizer';
import { ErrorNames, StatusCodes } from '../../types/errors.type';
import getError from '../../types/utils/getError';

const extract = (adminOnly?: boolean) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.token) {
      return next(getError(ErrorNames.JsonWebTokenError));
    }

    const decoded = await tokenizer.verifyAccessToken(req.token);

    if (decoded && typeof decoded !== 'string') {
      req.user = await userService.getByUsername(decoded.username);
    }

    if (req.user) {
      const { id, username } = req.params;
      const isUserRoute = req.originalUrl.includes(routes.paths.users);
      const isSingleUserRoute = isUserRoute && (id || username);

      if (req.user.disabled) {
        return next(
          getError({ message: 'User is disabled!', status: StatusCodes.UNAUTHORIZED, name: ErrorNames.UserDisabled }),
        );
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
