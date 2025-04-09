import 'reflect-metadata';
import express from 'express';
import http from 'http';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { envConfig } from './config/env.config';
import AppDataSource from './database/config';

async function bootstrap() {
  const app = express();
  const httpServer: http.Server = new http.Server(app);

  app.set('trust proxy', 1);
  app.use(
    cookieSession({
      name: 'session',
      keys: [envConfig.SECRET_KEY_ONE, envConfig.SECRET_KEY_TWO],
      maxAge: 24 * 7 * 3600000
    })
  );
  const corsOptions = {
    origin: [envConfig.REACT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  };
  app.use(cors(corsOptions));

  try {
    httpServer.listen(envConfig.PORT, () => {
      console.log(`Server is running on port ${envConfig.PORT}`);
    });
  } catch (error) {
    console.log('Error starting server:', error);
  }
}

AppDataSource.initialize()
  .then(() => {
    console.log('PostgreSQL database connected successfully.');
    bootstrap().catch(console.error);
  })
  .catch((error) => console.log('Error connecting to PostgreSQL.', error));
