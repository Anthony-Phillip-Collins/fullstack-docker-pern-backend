import { NextFunction, Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import UserModel from '../sequelize/models/user.model';
import userService from '../sequelize/services/user.service';
import { StatusCodes } from '../types/errors.type';
import { parseNewUserFields, parseUpdateUserFields } from '../types/utils/parsers/user.parser';
import { nextError } from '../utils/middleware/errorHandler';

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
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { username, name, password } = parseNewUserFields(req.body);
    const user = await userService.addOne({ username, name, password });
    res.status(StatusCodes.CREATED).json(user);
  })
);

router.delete('/', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot delete all users!'));
});

router.patch('/', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot update all users!'));
});

router.put('/', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('You cannot replace all users!'));
});

/* Single User routes */

const findByIdMiddleware = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  req.user = await UserModel.findByPk(req.params.id);
  next();
});

router.get('/:id', findByIdMiddleware, (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    const error = nextError('User not found!', StatusCodes.NOT_FOUND);
    next(error);
  } else {
    res.json(req.user);
  }
});

router.post('/:id', (_req: Request, _res: Response, next: NextFunction) => {
  const error = nextError('You cannot create a user with a specific id!', StatusCodes.NOT_IMPLEMENTED);
  next(error);
});

router.put('/:id', (_req: Request, _res: Response, next: NextFunction) => {
  const error = nextError(
    'You cannot replace a user with a specific id! Use PATCH instead.',
    StatusCodes.NOT_IMPLEMENTED
  );
  next(error);
});

router.patch(
  '/:id',
  findByIdMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = nextError('User not found!', StatusCodes.NOT_FOUND);
      return next(error);
    }
    const update = parseUpdateUserFields(req.body);
    const user = await userService.updateOne(req.user.id, update);
    res.json(user);
  })
);

router.delete(
  '/:id',
  findByIdMiddleware,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = nextError('User no longer exists!', StatusCodes.GONE);
      return next(error);
    }

    await req.user.destroy();
    res.json(req.user);
  })
);

const userRouter = router;

export default userRouter;
