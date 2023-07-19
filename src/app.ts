import cors from 'cors';
import express, { Express } from 'express';
import routes from './controllers';
import logger from './util/logger';
import errorHandler from './util/middleware/errorHandler';
import requestLogger from './util/middleware/requestLogger';
import tokenExtractor from './util/middleware/tokenExtractor';
import unknownEndpoint from './util/middleware/unknownEndpoint';
import { PORT } from './config';

export const init = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(tokenExtractor);

  routes.init(app);

  app.use(unknownEndpoint);
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};
