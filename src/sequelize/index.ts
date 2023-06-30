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
import { userModelInit } from './models/user.model';

const initModels = async (sequelize: Sequelize) => {
  const models = [blogModelInit, userModelInit];
  const sync = models.map((model) => model(sequelize).sync());
  return Promise.all(sync);
};

const getOptions = () => {
  // check if we are running on heroku (DYNO) otherwise local development
  const herokuOptions = { ssl: { require: true, rejectUnauthorized: false } };
  return process.env.DYNO ? { dialectOptions: herokuOptions } : {};
};

const authenticate = async (): Promise<void> => {
  const sequelize = new Sequelize(process.env.DATABASE_URL || '', getOptions());
  await initModels(sequelize);
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
