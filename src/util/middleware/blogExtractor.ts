import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import routes from '../../controllers';
import Blog from '../../sequelize/models/blog.model';
import { StatusCodes } from '../../types/errors.type';
import getError from '../../types/utils/getError';

const extract = (needsAuthentication?: boolean) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    const isBlogRoute = req.originalUrl.includes(routes.paths.blogs);
    const isSingleBlogRoute = isBlogRoute && id;

    if (isSingleBlogRoute) {
      req.blog = await Blog.findByPk(id);

      if (needsAuthentication) {
        const user = req?.user;
        if (!(user?.admin || req?.blog?.ownerId === user?.id)) {
          throw getError({
            message: 'Only the owner or admin can perform operations on a blog!',
            status: StatusCodes.FORBIDDEN,
          });
        }
      }
    }

    next();
  });

export const blogExtractor = extract();
export const blogExtractorAuth = extract(true);
