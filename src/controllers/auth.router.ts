import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import authService from '../sequelize/services/auth.service';
import { parseUser } from '../sequelize/util/parsers';
import tokenizer from '../sequelize/util/tokenizer';
import { StatusCodes } from '../types/errors.type';
import { parseString } from '../types/utils/parsers/common/string.parser';
import { parseUserLogin } from '../types/utils/parsers/user.parser';
import { userExtractor } from '../util/middleware/userExtractor';
import getError from '../types/utils/getError';

const router = Router();

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { username, password } = parseUserLogin(req.body);
    const userWithToken = await authService.login({ username, password });
    res.json(userWithToken);
  }),
);

router.post(
  '/logout',
  userExtractor,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const user = parseUser(req.user);
    await authService.logout(user.username);
    res.sendStatus(StatusCodes.NO_CONTENT);
  }),
);

router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.refreshToken) {
      next(getError({ message: 'Refresh token missing!', status: StatusCodes.UNAUTHORIZED }));
    }

    const token = parseString(req.body.refreshToken, 'refreshToken');
    const userForToken = await tokenizer.verifyRefreshToken(token);

    if (!userForToken) {
      next(getError({ message: 'Invalid refresh token!', status: StatusCodes.UNAUTHORIZED }));
      return;
    }

    const userWithToken = await tokenizer.signTokens(userForToken);

    res.json(userWithToken);
  }),
);

const loginRouter = router;

export default loginRouter;
