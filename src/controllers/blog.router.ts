import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import Blog from '../sequelize/models/blog.model';
import blogService from '../sequelize/services/blog.service';
import { StatusCodes } from '../types/errors.type';
import { parseBlog, parseUser } from '../sequelize/util/parsers';
import { parseBlogQuery, parseNewBlog, parseUpdateBlog } from '../types/utils/parsers/blog.parser';
import { userExtractor } from '../utils/middleware/userExtractor';

export const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const query = parseBlogQuery(_req.query);
    const blogs = await blogService.getAll(query);
    res.json(blogs);
  })
);

router.post(
  '/',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const newBlog = parseNewBlog(req.body);
    const user = parseUser(req.user);
    const blog = await blogService.addOne(newBlog, user);
    res.status(StatusCodes.CREATED).json(blog);
  })
);

/* Single Blog routes */

const findByIdMiddleware = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
});

router.get('/:id', findByIdMiddleware, (req: Request, res: Response, _next: NextFunction) => {
  const blog = parseBlog(req.blog);
  res.json(blog);
});

router.put(
  '/:id',
  findByIdMiddleware,
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const blog = parseBlog(req.blog);
    const user = parseUser(req.user);
    blog.auth(user);
    const update = parseUpdateBlog(req.body);
    await blog.update(update);
    res.json({ likes: blog.likes });
  })
);

router.delete(
  '/:id',
  findByIdMiddleware,
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const blog = parseBlog(req.blog);
    const user = parseUser(req.user);
    blog.auth(user);
    await blog.destroy();
    res.status(StatusCodes.NO_CONTENT).json({});
  })
);

const blogRouter = router;

export default blogRouter;
