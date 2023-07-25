import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import routes from '../../controllers';
import readingService from '../../sequelize/services/reading.service';
import { StatusCodes } from '../../types/errors.type';
import getError from '../../types/utils/getError';

const extract = (needsAuthentication?: boolean) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    const isReadingRoute = req.originalUrl.includes(routes.paths.readings);
    const isSingleReadingRoute = isReadingRoute && id;

    if (isSingleReadingRoute) {
      req.reading = await readingService.getById(id);

      if (needsAuthentication) {
        const user = req?.user;
        if (!(user?.admin || req?.reading?.userId === user?.id)) {
          throw getError({
            message: 'Only the owner or admin can perform operations on readings!',
            status: StatusCodes.FORBIDDEN,
          });
        }
      }
    }

    next();
  });

export const readingExtractor = extract();
export const readingExtractorAuth = extract(true);
