import dotenv from 'dotenv';
import { cleanEnv, str, port, bool } from 'envalid';

dotenv.config();

export const envConfig = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  PORT: port({ default: 5000 }),
  DB_HOST: str(),
  DB_PORT: port({ default: 5432 }),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_DATABASE: str(),
  TEST_DB_HOST: str(),
  TEST_DB_PORT: port(),
  TEST_DB_USERNAME: str(),
  TEST_DB_PASSWORD: str(),
  TEST_DB_DATABASE: str(),
  ENCRYPTION_SECRET: str(),
  SECRET_KEY_ONE: str(),
  SECRET_KEY_TWO: str(),
  REACT_URL: str(),
  JWT_ACCESS_SECRET: str(),
  DB_SSL: bool({ default: false }),
  CLAUDE_API_KEY: str()
});
