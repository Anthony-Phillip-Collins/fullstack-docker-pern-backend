import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import userService from '../sequelize/services/user.service';
import { parseUser } from '../sequelize/util/parsers';
import { parseUserLogin } from '../types/utils/parsers/user.parser';
import { userExtractor } from '../utils/middleware/userExtractor';

const router = Router();

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = parseUserLogin(req.body);
    const UserWithToken = await userService.login({ username, password });
    res.json(UserWithToken);
  })
);

router.get(
  '/',
  userExtractor,
  asyncHandler((req: Request, res: Response, _next: NextFunction) => {
    const user = parseUser(req.user);
    res.json(user);
  })
);

const loginRouter = router;

export default loginRouter;
