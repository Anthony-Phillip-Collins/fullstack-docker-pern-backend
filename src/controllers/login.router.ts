import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../sequelize/services/user.service';
import { parseUserLogin } from '../types/utils/parsers/user.parser';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = parseUserLogin(req.body);
    const UserWithToken = await userService.login({ username, password });
    res.json(UserWithToken);
  })
);

const loginRouter = router;

export default loginRouter;
