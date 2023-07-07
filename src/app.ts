import cors from 'cors';
import express, { Express } from 'express';
import constants from './constants';
import routes from './controllers';
import logger from './utils/logger';
import errorHandler from './utils/middleware/errorHandler';
import requestLogger from './utils/middleware/requestLogger';
import tokenExtractor from './utils/middleware/tokenExtractor';
import unknownEndpoint from './utils/middleware/unknownEndpoint';

export const init = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);
  app.use(tokenExtractor);

  routes.init(app);

  app.use(unknownEndpoint);
  app.use(errorHandler);

  const { PORT } = constants;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};
