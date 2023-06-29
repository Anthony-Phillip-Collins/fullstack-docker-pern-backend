import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from '../types/errors.type';
import { parseNewBlog, parseUpdateBlog } from '../types/utils/parsers/blog.parser';
import { nextError } from '../utils/middleware/errorHandler';
import BlogModel from '../sequelize/models/blog.model';
import blogService from '../sequelize/services/blog.service';

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
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const newBlog = parseNewBlog(req.body);
    const blog = await blogService.addOne(newBlog);
    res.json(blog);
  })
);

router.delete('/', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot delete all blogs!'));
});

router.patch('/', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot update all blogs!'));
});

router.put('/', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot replace all blogs!'));
});

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

router.post('/:id', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot create a blog with a specific id!'));
});

router.put('/:id', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot replace a blog with a specific id! Use PATCH instead.'));
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
