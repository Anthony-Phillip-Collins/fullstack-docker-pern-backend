import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../sequelize/services/user.service';
import { StatusCodes } from '../types/errors.type';
import userExtractor from '../utils/middleware/userExtractor';
import { parseNewUserTypeFields } from '../types/utils/parsers/user.parser';

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
    const { username, name, password } = parseNewUserTypeFields(req.body);
    const user = await userService.addOne({ username, name, password });
    res.status(StatusCodes.CREATED).json(user);
  })
);

const userRouter = router;

export default userRouter;
