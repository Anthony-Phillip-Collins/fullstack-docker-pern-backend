import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import routes from '../../controllers';
import likeService from '../../sequelize/services/like.service';
import { StatusCodes } from '../../types/errors.type';
import getError from '../../types/utils/getError';

const extract = (needsAuthentication?: boolean) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    const isLikeRoute = req.originalUrl.includes(routes.paths.likes);
    const isSingleLikeRoute = isLikeRoute && id;

    if (isSingleLikeRoute) {
      req.like = await likeService.getById(id);

      if (needsAuthentication) {
        const user = req?.user;
        if (!(user?.admin || req?.like?.userId === user?.id)) {
          throw getError({
            message: 'Only the owner or admin can perform operations on likes!',
            status: StatusCodes.FORBIDDEN,
          });
        }
      }
    }

    next();
  });

export const likeExtractor = extract();
export const likeExtractorAuth = extract(true);
