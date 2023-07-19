import { createClient } from 'redis';
import logger from '../util/logger';
import { REDIS_URL } from '../config';

const client = createClient({
  url: REDIS_URL,
});

client.on('error', (error) => {
  logger.info('------------------------------------------');
  logger.error('Error: Redis Client Error!', error);
  logger.info('------------------------------------------');
});

export const redis = {
  client,
  connect: () => client.connect(),
  get: (key: string) => client.get(key),
  set: (key: string, value: string) => client.set(key, value),
  del: (key: string) => client.del(key),
};

export default redis;
