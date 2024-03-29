import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../sequelize/services/user.service';
import { parseUser } from '../sequelize/util/parsers';
import { StatusCodes } from '../types/errors.type';
import {
  parseUserCreateInput,
  parseUserQuery,
  parseUserUpdateAsAdminInput,
  parseUserUpdateAsUserInput,
} from '../types/utils/parsers/user.parser';
import { adminExtractor, userExtractor } from '../util/middleware/userExtractor';
import tokenizer from '../sequelize/util/tokenizer';
import getError from '../types/utils/getError';

export const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userService.getAll();
    res.json(users);
  }),
);

router.post(
  '/',
  adminExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const data = parseUserCreateInput(req.body);
    const { username, name, password } = data;
    const user = await userService.addOne({ username, name, password });
    const userWithTokens = await tokenizer.signTokens({ username, name, id: user.id });
    res.status(StatusCodes.CREATED).json(userWithTokens);
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const query = parseUserQuery(req.query);
    const user = await userService.getById(req.params.id, query);
    if (!user) {
      throw getError({ message: 'User not found!', status: StatusCodes.NOT_FOUND });
    }
    res.json(user);
  }),
);

router.put(
  '/:username',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const userLoggedIn = parseUser(req.user);
    const user = parseUser(req.userOfSingleRoute);
    let update, updated;

    if (userLoggedIn.admin) {
      update = parseUserUpdateAsAdminInput(req.body);
      // updated = await userService.updateOneAsAdmin(user, update); /* implement admin updates later */
      updated = await userService.updateOneAsUser(user, update);
    } else {
      update = parseUserUpdateAsUserInput(req.body);
      updated = await userService.updateOneAsUser(user, update);
    }
    res.json(updated);
  }),
);

router.delete(
  '/:username',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = parseUser(req.userOfSingleRoute);
    if (user.username === 'admin@foobar.com') {
      throw getError({ message: 'Cannot delete admin user!', status: StatusCodes.BAD_REQUEST });
    }
    await user.destroy();
    res.status(StatusCodes.NO_CONTENT).json({});
  }),
);

const userRouter = router;

export default userRouter;
