import express, { Request, Response } from 'express';
const router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).send(`Hello API! env: ${process.env.NODE_ENV} db: ${process.env.DATABASE_URL}`);
});

const baseRouter = router;

export default baseRouter;
