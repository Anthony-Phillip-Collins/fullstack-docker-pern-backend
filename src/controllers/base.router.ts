import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).send(`Hello API! env: ${process.env.NODE_ENV}`);
});

const baseRouter = router;

export default baseRouter;
