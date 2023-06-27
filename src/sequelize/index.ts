import retryAsPromised from 'retry-as-promised';
import {
  ConnectionAcquireTimeoutError,
  ConnectionError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  Sequelize,
} from 'sequelize';
import logger from '../utils/logger';
import { blogModelInit } from './models/blog.model';

console.log(process.env.DATABASE_URL);

const authenticate = (): Promise<void> => {
  const sequelize = new Sequelize(process.env.DATABASE_URL || '', {
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false,
      // },
    },
  });

  const models = [blogModelInit];
  models.forEach((model) => {
    model(sequelize);
  });
  return sequelize.authenticate();
};

const connectToPostgres = retryAsPromised((_options) => authenticate(), {
  max: 5,
  timeout: 10000,
  match: [
    ConnectionAcquireTimeoutError,
    ConnectionError,
    ConnectionRefusedError,
    ConnectionTimedOutError,
    /Deadlock/i,
    'SQLITE_BUSY',
  ],
  backoffBase: 2000,
  backoffExponent: 2,
  report: (msg, _object) => logger.info(msg),
  name: 'Postgres',
});

export default connectToPostgres;
