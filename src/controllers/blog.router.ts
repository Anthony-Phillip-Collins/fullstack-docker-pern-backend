import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import blogService from '../sequelize/services/blog.service';
import { parseBlog, parseUser } from '../sequelize/util/parsers';
import { StatusCodes } from '../types/errors.type';
import { parseBlogQuery, parseNewBlog, parseUpdateBlog } from '../types/utils/parsers/blog.parser';
import { blogExtractor, blogExtractorAuth } from '../util/middleware/blogExtractor';
import { userExtractor } from '../util/middleware/userExtractor';

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

router.get('/:id', blogExtractor, (req: Request, res: Response, _next: NextFunction) => {
  const blog = parseBlog(req.blog);
  res.json(blog);
});

router.put(
  '/:id',
  userExtractor,
  blogExtractorAuth,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const blog = parseBlog(req.blog);
    // validate Auth is working!
    // const user = parseUser(req.user);
    // blog.auth(user);
    const update = parseUpdateBlog(req.body);
    await blog.update(update);
    res.json({ likes: blog.likes });
  })
);

router.delete(
  '/:id',
  userExtractor,
  blogExtractorAuth,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const blog = parseBlog(req.blog);
    // !validate Auth is working!
    // const user = parseUser(req.user);
    // blog.auth(user);
    await blog.destroy();
    res.status(StatusCodes.NO_CONTENT).json({});
  })
);

const blogRouter = router;

export default blogRouter;
