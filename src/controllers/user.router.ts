import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../sequelize/services/user.service';
import { parseUser } from '../sequelize/util/parsers';
import { StatusCodes } from '../types/errors.type';
import {
  parseUserCreateInput,
  parseUserUpdateAsAdminInput,
  parseUserUpdateAsUserInput,
} from '../types/utils/parsers/user.parser';
import { getError } from '../utils/middleware/errorHandler';
import { adminExtractor, userExtractor } from '../utils/middleware/userExtractor';

export const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const users = await userService.getAll();
    res.json(users);
  })
);

router.post(
  '/',
  adminExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { username, name, password, admin, disabled } = parseUserCreateInput(req.body);
    const user = await userService.addOne({ username, name, password, admin, disabled });
    res.status(StatusCodes.CREATED).json(user);
  })
);

/* Single User routes */

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = await userService.getById(req.params.id);
    if (!user) {
      throw getError({ message: 'User not found!', status: StatusCodes.NOT_FOUND });
    }

    res.json(user);
  })
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
      updated = await userService.updateOneAsAdmin(user, update);
    } else {
      update = parseUserUpdateAsUserInput(req.body);
      updated = await userService.updateOneAsUser(user, update);
    }
    res.json(updated);
  })
);

router.delete(
  '/:username',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = parseUser(req.userOfSingleRoute);
    await user.destroy();
    res.status(StatusCodes.NO_CONTENT).json({});
  })
);

const userRouter = router;

export default userRouter;
