import 'reflect-metadata';
import { container } from 'tsyringe';

import 'dotenv/config';

import '@shared/container';

import '@shared/infra/typeorm';

import { dataSource } from '../typeorm/index';
import { Queue } from './queue';

const queue = container.resolve(Queue);

dataSource.then(data => {
  if (data.isInitialized) {
    queue.run();
  }
});
