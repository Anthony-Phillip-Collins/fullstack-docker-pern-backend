import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import Blog from '../sequelize/models/blog.model';
import { getError } from '../util/middleware/errorHandler';
import { StatusCodes } from '../types/errors.type';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, next: NextFunction) => {
    const sequelize = Blog.sequelize;

    if (!sequelize) {
      return next(getError({ message: 'Sequelize is not initialized', status: StatusCodes.INTERNAL_SERVER_ERROR }));
    }

    const { fn, col } = sequelize;

    const blogs = await Blog.findAll({
      group: ['author'],
      attributes: ['author', [fn('COUNT', col('author')), 'blogs'], [fn('SUM', col('likes')), 'likes']],
      order: [['likes', 'DESC']],
    });

    const authors = blogs.map((blog) => blog.toJSON());

    res.send(authors);
  })
);

const authorRouter = router;

export default authorRouter;