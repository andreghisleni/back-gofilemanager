import Queue from 'bull';

import { redisConfig } from '@config/redis';

import * as jobs from '../jobs';
import { IBackendJobsProvider } from '../models/IBackendJobsProvider';

interface IQueue {
  bull: Queue.Queue;
  name: string;
  handle: any; // eslint-disable-line
}

export class BullBackendJobsProvider implements IBackendJobsProvider {
  queues: IQueue[];

  constructor() {
    this.queues = Object.values(jobs).map(job => ({
      bull: new Queue(job.key, {
        redis: redisConfig,
        limiter: job.limiter || undefined,
        defaultJobOptions: job?.defaultJobOptions || undefined,
      }),
      name: job.key,
      handle: job.handle,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addQueue(name: string, data: unknown): Promise<Queue.Job<any>> | undefined {
    const queue = this.queues.find(q => q.name === name);

    return queue?.bull.add(data);
  }

  processQueue(): void {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);
      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.name, job.data); // eslint-disable-line
        console.log(err); // eslint-disable-line
      });
    });
  }
}
