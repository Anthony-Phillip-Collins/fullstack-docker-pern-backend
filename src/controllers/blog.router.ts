import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import BlogModel from '../sequelize/models/blog.model';
import blogService from '../sequelize/services/blog.service';
import { StatusCodes } from '../types/errors.type';
import { parseNewBlog, parseUpdateBlog } from '../types/utils/parsers/blog.parser';
import { nextError } from '../utils/middleware/errorHandler';
import userExtractor from '../utils/middleware/userExtractor';

export const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const blogs = await blogService.getAll();
    res.json(blogs);
  })
);

router.post(
  '/',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = nextError('User not found!', StatusCodes.UNAUTHORIZED);
      return next(error);
    }
    const newBlog = parseNewBlog({ ...req.body });
    const blog = await blogService.addOne(newBlog);
    res.status(StatusCodes.CREATED).json(blog);
  })
);

/* Single Blog routes */

const findByIdMiddleware = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  req.blog = await BlogModel.findByPk(req.params.id);
  next();
});

router.get('/:id', findByIdMiddleware, (req: Request, res: Response, next: NextFunction) => {
  if (!req.blog) {
    const error = nextError('Blog not found!', StatusCodes.NOT_FOUND);
    next(error);
  } else {
    res.json(req.blog);
  }
});

router.patch(
  '/:id',
  findByIdMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.blog) {
      const error = nextError('Blog not found!', StatusCodes.NOT_FOUND);
      return next(error);
    }
    const update = parseUpdateBlog(req.body);
    const blog = await req.blog.update(update);
    res.json({ likes: blog.likes });
  })
);

router.delete(
  '/:id',
  findByIdMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.blog) {
      const error = nextError('Blog no longer exists!', StatusCodes.GONE);
      return next(error);
    }

    await req.blog.destroy();
    res.json(req.blog);
  })
);

const blogRouter = router;

export default blogRouter;
