import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../sequelize/services/user.service';
import { StatusCodes } from '../types/errors.type';
import { UserNonSensitive } from '../types/user.type';
import { parseUserCreatePassword } from '../types/utils/parsers/user.parser';
import userExtractor from '../utils/middleware/userExtractor';
import { parseUser } from '../sequelize/util/parsers';

export const router = Router();

router.get(
  '/',
  userExtractor,
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userService.getAll();
    res.json(users);
  })
);

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { username, name, password } = parseUserCreatePassword(req.body);
    const user = await userService.addOne({ username, name, password });
    res.status(StatusCodes.CREATED).json(user);
  })
);

/* Single User routes */

router.get('/:id', userExtractor, (req: Request, res: Response, _next: NextFunction) => {
  const user = parseUser(req.user);
  const userNonSensitive: UserNonSensitive = {
    id: user.id,
    name: user.name,
    username: user.username,
  };
  res.json(userNonSensitive);
});

router.patch(
  '/:id',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = parseUser(req.user);
    user.auth(req.params.id);
    const update = parseUserCreatePassword(req.body);
    const updated = await userService.updateOne(user, update);
    res.json(updated);
  })
);

router.delete(
  '/:id',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = parseUser(req.user);
    user.auth(req.params.id);
    await user.destroy();
    res.status(StatusCodes.NO_CONTENT).json({});
  })
);

const userRouter = router;

export default userRouter;
