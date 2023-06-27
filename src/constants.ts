import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 4000;
const API_BASE_URL = process.env.API_BASE_URL || '/api';
const JWT_SECRET = process.env.JWT_SECRET || '';
const DATABASE_URL = process.env.DATABASE_URL || '';
const IS_MONGODB = DATABASE_URL.includes('mongodb');

export default { API_BASE_URL, PORT, JWT_SECRET, DATABASE_URL, IS_MONGODB };
