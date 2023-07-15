import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import readingService from '../sequelize/services/reading.service';
import { parseReading, parseUser } from '../sequelize/util/parsers';
import { parseReadingCreation } from '../types/utils/parsers/reading.parser';
import { userExtractor } from '../util/middleware/userExtractor';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const readings = await readingService.getAll();
    res.json(readings);
  })
);

router.post(
  '/',
  userExtractor,
  asyncHandler(async (req, res) => {
    const user = parseUser(req.user);
    const data = parseReadingCreation({ ...req.body, userId: user.id });
    const reading = await readingService.addOne(data);
    res.json(reading);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const reading = await readingService.getById(req.params.id);
    res.json(reading);
  })
);

router.delete(
  '/:id',
  userExtractor,
  asyncHandler(async (req, res) => {
    const user = parseUser(req.user);
    const reading = parseReading(await readingService.getById(req.params.id));
    await user.removeReading(reading.id);
    res.json({});
  })
);

const readingRouter = router;

export default readingRouter;
