import redis from '../redis';
import connectToPostgres from '../sequelize';
import logger from './logger';

const connectToDatabase = async () => {
  try {
    await connectToPostgres();
    logger.info('------------------------------------------');
    logger.info('Connected to Postgres :)');
    logger.info('------------------------------------------');
  } catch (error) {
    logger.info('------------------------------------------');
    logger.error('Error: Unable to connect to Postgres', error);
    logger.info('------------------------------------------');
  }

  try {
    await redis.connect();
    logger.info('------------------------------------------');
    logger.info('Connected to Redis :)');
    logger.info('------------------------------------------');
  } catch (error) {
    logger.info('------------------------------------------');
    logger.error('Error: Unable to connect to Redis', error);
    logger.info('------------------------------------------');
  }
};

export default connectToDatabase;
