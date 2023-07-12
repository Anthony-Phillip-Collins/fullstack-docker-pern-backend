import retryAsPromised from 'retry-as-promised';
import {
  ConnectionAcquireTimeoutError,
  ConnectionError,
  ConnectionRefusedError,
  ConnectionTimedOutError,
  QueryInterface,
  Sequelize,
} from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
import logger from '../util/logger';
import Blog, { blogInit } from './models/blog.model';
import User, { userInit } from './models/user.model';

const initModels = async (sequelize: Sequelize) => {
  const models = [userInit, blogInit];
  const sync = models.map((model) => model(sequelize));

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

export let umzug: Umzug<QueryInterface>;

const initMigrations = (sequelize: Sequelize) => {
  const migrationConf = {
    migrations: { glob: 'db/migrations/*.ts' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    logger: console,
  };

  umzug = new Umzug(migrationConf);
  // await umzug.up();
};

const getSequelizeOptions = () => {
  // check if we are running on heroku (DYNO) otherwise local development
  const herokuOptions = { ssl: { require: true, rejectUnauthorized: false } };
  return process.env.DYNO ? { dialectOptions: herokuOptions } : {};
};

const authenticate = async (): Promise<void> => {
  const sequelize = new Sequelize(process.env.DATABASE_URL || '', getSequelizeOptions());
  await sequelize.authenticate();
  await initModels(sequelize);
  initMigrations(sequelize);
};

const init = async () => {
  await authenticate();
  await umzug.up();
};

const connectToPostgres = () =>
  retryAsPromised((_options) => init(), {
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

export const rollback = async () => {
  await authenticate();
  await umzug.down({ step: 1 });
};

export const rollforward = async () => {
  await authenticate();
  await umzug.up({ step: 1 });
};

export default connectToPostgres;
