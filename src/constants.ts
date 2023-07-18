import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 4000;
const API_BASE_URL = process.env.API_BASE_URL || '/api';
const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '10m';
const DATABASE_URL = process.env.DATABASE_URL || '';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default { API_BASE_URL, PORT, JWT_SECRET, JWT_EXPIRY, DATABASE_URL, IS_PRODUCTION };
