import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from '../types/errors.type';
import { parseNewBlog, parseUpdateBlog } from '../types/utils/parsers/blog.parser';
import blogService from '../services/blog.service';

export const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const blogs = await blogService.getAll();
    res.status(StatusCodes.OK).json(blogs);
  })
);

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const newBlog = parseNewBlog(req.body);
    const blog = await blogService.addOne(newBlog);
    res.status(StatusCodes.OK).json(blog);
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
  const blog = await blogService.getById(req.params.id);
  req.blog = blog;
  next();
});

router.get('/:id', findByIdMiddleware, (req: Request, res: Response, next: NextFunction) => {
  if (!req.blog) {
    const error = new Error('Blog not found!');
    error.status = StatusCodes.NOT_FOUND;
    next(error);
  } else {
    res.send(req.blog);
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
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const update = parseUpdateBlog(req.body);
    const blog = await blogService.updateOne(req.params.id, update);

    if (!blog) {
      const error = new Error('Blog not found!');
      error.status = StatusCodes.NOT_FOUND;
      return next(error);
    }

    res.status(StatusCodes.OK).json(blog);
  })
);

router.delete(
  '/:id',
  findByIdMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const blog = await blogService.deleteOne(req.params.id);
    if (!blog) {
      const error = new Error('Blog no longer exists!');
      error.status = StatusCodes.GONE;
      return next(error);
    }
    res.status(StatusCodes.OK).json(blog);
  })
);

const blogRouter = router;

export default blogRouter;
