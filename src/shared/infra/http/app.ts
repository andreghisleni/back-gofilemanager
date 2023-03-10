import 'reflect-metadata';
import 'dotenv/config';

import 'express-async-errors';

import { errors } from 'celebrate';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';

import uploadConfig from '@config/upload';

import { AppError } from '@shared/errors/AppError';

import { rateLimiter } from './middlewares/rateLimiter';
import { routes } from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.set('trust proxy', true);
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use('/files/download', express.static(uploadConfig.downloadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    await fs.unlink(req.file.path);
  }
  if (req.files) {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req.files as any[]).map((file: Express.Multer.File) =>
        fs.unlink(file.path),
      ),
    );
  }

  next(err);
});

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }
  console.error(err); // eslint-disable-line
  return res
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

export { app };
