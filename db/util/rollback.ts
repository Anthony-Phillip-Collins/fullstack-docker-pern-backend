import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { rollback } from '../../src/sequelize';

rollback().catch((err) => {
  console.error(err);
  process.exit(1);
});
