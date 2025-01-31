import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
const result = dotenv.config({ path: resolve(__dirname, '../.env') });

if (result.error) {
  throw new Error('Failed to load .env file');
}

export const config = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY,
  quickbase: {
    realmHostname: process.env.QB_REALM_HOSTNAME,
    userToken: process.env.QB_USER_TOKEN
  }
};
