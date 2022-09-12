import 'reflect-metadata';
import 'dotenv/config';

import '@shared/container';

import '@shared/infra/typeorm';

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import cors from 'cors';
import express from 'express';
import { container } from 'tsyringe';

import 'express-async-errors';

import { rateLimiter } from '../http/middlewares/rateLimiter';
import { Queue } from './queue';

const { queues } = container.resolve(Queue);

const app = express();

app.use(cors());
app.use(rateLimiter);

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: queues.map(queue => new BullMQAdapter(queue.bull)),
  serverAdapter,
});

app.use('/ui', serverAdapter.getRouter());

const port = process.env.PORT_BULL || 3334;
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}!`); // eslint-disable-line
});
