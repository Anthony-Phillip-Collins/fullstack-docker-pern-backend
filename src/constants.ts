import { config } from 'dotenv';

config();

export enum DB {
  POSTGRES = 'postgres',
  MONGODB = 'mongodb',
}

const PORT = process.env.PORT || 4000;
const API_BASE_URL = process.env.API_BASE_URL || '/api';
const JWT_SECRET = process.env.JWT_SECRET || '';
const DB_TYPE: DB = (process.env.DB as DB) || DB.POSTGRES;

export default { API_BASE_URL, PORT, JWT_SECRET, DB_TYPE };
