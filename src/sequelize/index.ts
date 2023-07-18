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
import Reading, { readingInit } from './models/reading.model';

const initModels = async (sequelize: Sequelize) => {
  const models = [userInit, blogInit, readingInit];
  const sync = models.map((model) => model(sequelize));

  await Promise.all(sync);

  User.hasMany(Blog, {
    sourceKey: 'id',
    foreignKey: 'ownerId',
    as: 'blogs',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
  });

  Blog.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
  });

  User.belongsToMany(Blog, {
    through: Reading,
    foreignKey: 'userId',
    as: 'readings',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
  });

  Blog.belongsToMany(User, {
    through: Reading,
    foreignKey: 'blogId',
    as: 'readers',
    onDelete: 'cascade',
    onUpdate: 'cascade',
    hooks: true,
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
  const migs = await umzug.up();
  console.log('**************************');
  console.log(migs);
  console.log('**************************');
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
