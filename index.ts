import http from 'http';
import app from './src/app';
import logger from './src/util/logger';

const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
