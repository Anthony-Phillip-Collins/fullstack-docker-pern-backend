import retryAsPromised from 'retry-as-promised';
import {
  ConnectionAcquireTimeoutError,
  ConnectionError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  Sequelize,
} from 'sequelize';
import logger from '../utils/logger';
import Blog, { blogInit } from './models/blog.model';
import User, { userInit } from './models/user.model';

const initModels = async (sequelize: Sequelize) => {
  const models = [userInit, blogInit];
  const sync = models.map((model) => model(sequelize).sync()); //{ alter: true }

  await Promise.all(sync);

  User.hasMany(Blog, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'blogs',
    onDelete: 'cascade',
    hooks: true,
  });

  Blog.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
  });
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
