import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { rollforward } from '../../src/sequelize';

rollforward().catch((err) => {
  console.error(err);
  process.exit(1);
});
