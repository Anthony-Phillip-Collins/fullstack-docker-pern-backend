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

// check if we are running on heroku (DYNO) otherwise local development
const dialectOptions = process.env.DYNO
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const authenticate = async (): Promise<void> => {
  const sequelize = new Sequelize(process.env.DATABASE_URL || '', { dialectOptions });
  const models = [blogModelInit];
  const sync = models.map((model) => model(sequelize).sync());
  await Promise.all(sync);
  return sequelize.authenticate();
};

export const connectToPostgres = () =>
  retryAsPromised((_options) => authenticate(), {
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
