import cors from 'cors';
import express, { Express } from 'express';
import constants from './constants';
import routes from './controllers';
import errorHandler from './utils/middleware/errorHandler';
import requestLogger from './utils/middleware/requestLogger';
import unknownEndpoint from './utils/middleware/unknownEndpoint';
import logger from './utils/logger';

export const init = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  routes(app);

  app.use(unknownEndpoint);
  app.use(errorHandler);

  const { PORT } = constants;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};
