import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import Blog from '../sequelize/models/blog.model';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const sequelize = Blog.sequelize;

    if (!sequelize) throw new Error('Sequelize is not initialized');

    const { fn, col } = sequelize;

    const blogs = await Blog.findAll({
      group: ['author'],
      attributes: ['author', [fn('COUNT', col('author')), 'blogs'], [fn('SUM', col('likes')), 'likes']],
    });

    const authors = blogs.map((blog) => blog.toJSON());

    res.send(authors);
  })
);

const authorRouter = router;

export default authorRouter;
