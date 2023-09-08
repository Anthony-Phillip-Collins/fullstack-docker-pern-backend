import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import likeService from '../sequelize/services/like.service';
import { parseLike, parseUser } from '../sequelize/util/parsers';
import { StatusCodes } from '../types/errors.type';
import { userExtractor } from '../util/middleware/userExtractor';
import { parseLikeCreation } from '../types/utils/parsers/like.parser';
import { likeExtractor, likeExtractorAuth } from '../util/middleware/likeExtractor ';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const likes = await likeService.getAll();
    res.json(likes);
  }),
);

router.post(
  '/',
  userExtractor,
  asyncHandler(async (req, res) => {
    const user = parseUser(req.user);
    const data = parseLikeCreation({ ...req.body, userId: user.id });
    const like = await likeService.addOne(data);
    res.json(like);
  }),
);

router.get(
  '/:id',
  likeExtractor,
  asyncHandler((req, res) => {
    const like = parseLike(req.like);
    res.json(like);
  }),
);

router.delete(
  '/:id',
  userExtractor,
  likeExtractorAuth,
  asyncHandler(async (req, res) => {
    const user = parseUser(req.user);
    const like = parseLike(req.like);
    await user.removeLiking(like.id);
    await likeService.deleteOne(like);
    res.status(StatusCodes.NO_CONTENT).end();
  }),
);

const likeRouter = router;

export default likeRouter;
