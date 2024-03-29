import cors from 'cors';
import express from 'express';
import routes from './controllers';
import errorHandler from './util/middleware/errorHandler';
import requestLogger from './util/middleware/requestLogger';
import tokenExtractor from './util/middleware/tokenExtractor';
import unknownEndpoint from './util/middleware/unknownEndpoint';
import connectToDatabase from './util/connectToDatabase';
import logger from './util/logger';

const app = express();

const init = async () => {
  await connectToDatabase();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(tokenExtractor);

  routes.init(app);

  app.use(unknownEndpoint);
  app.use(errorHandler);
};

init()
  .then(() => {
    logger.info('Express initialized');
  })
  .catch((error) => {
    logger.error(error);
  });

export default app;
