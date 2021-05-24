import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
} else {
  dotenv.config({ path: '.env.example' });
}
export const ENVIRONMENT: any = process.env.NODE_ENV || '';
//const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const JWT_SECRET: any = process.env['JWT_SECRET'];

if (!JWT_SECRET) {
  process.exit(1);
}
