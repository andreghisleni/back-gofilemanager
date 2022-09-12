import 'reflect-metadata';
import 'dotenv/config';

import '@shared/container';
import { container } from 'tsyringe';

import '@shared/infra/typeorm';

import { Queue } from './queue';

const queue = container.resolve(Queue);

queue.run();
