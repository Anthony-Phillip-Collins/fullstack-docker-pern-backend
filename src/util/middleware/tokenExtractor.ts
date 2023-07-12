import { NextFunction, Request, Response } from 'express';

const tokenExtractor = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  const authenticationScheme = 'bearer ';
  if (authorization && authorization.toLowerCase().startsWith(authenticationScheme)) {
    req.token = authorization.substring(authenticationScheme.length);
  }
  next();
};

export default tokenExtractor;
