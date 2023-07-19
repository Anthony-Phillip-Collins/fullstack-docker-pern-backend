import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import redis from '../redis';
import readingService from '../sequelize/services/reading.service';
import { parseReading, parseUser } from '../sequelize/util/parsers';
import { parseReadingCreation, parseReadingQuery, parseReadingUpdate } from '../types/utils/parsers/reading.parser';
import { readingExtractor, readingExtractorAuth } from '../util/middleware/readingExtractor';
import { userExtractor } from '../util/middleware/userExtractor';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const query = parseReadingQuery(req.query);
    const readings = await readingService.getAll(query);

    await redis.set('user', JSON.stringify({ name: 'John Doe' }));

    console.log('================================');
    console.log((await redis.get('user')) || 'no user');
    console.log('================================');
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
  readingExtractor,
  asyncHandler((req, res) => {
    const reading = parseReading(req.reading);
    res.json(reading);
  })
);

router.put(
  '/:id',
  userExtractor,
  readingExtractorAuth,
  asyncHandler(async (req, res) => {
    const reading = parseReading(req.reading);
    const update = parseReadingUpdate(req.body);
    await readingService.updateOne(reading, update);
    res.json(reading);
  })
);

router.delete(
  '/:id',
  userExtractor,
  readingExtractorAuth,
  asyncHandler(async (req, res) => {
    const user = parseUser(req.user);
    const reading = parseReading(req.reading);
    await user.removeReading(reading.id);
    res.json({});
  })
);

const readingRouter = router;

export default readingRouter;
