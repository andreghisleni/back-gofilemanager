import { instanceToInstance } from 'class-transformer';
import { format } from 'date-fns';
import fs from 'fs/promises';
import path from 'node:path';
import { inject, injectable } from 'tsyringe';
import { zip, COMPRESSION_LEVEL } from 'zip-a-folder';

import { uploadConfig } from '@config/upload';

import { IBackendJobsProvider } from '@shared/container/providers/BackendJobs/models/IBackendJobsProvider';

import { ICategoriesRepository } from '@modules/transactions/repositories/ICategoriesRepository';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

// interface IRequest {}

@injectable()
export class ExportBackupService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('BackendJobsProvider')
    private backendJobsProvider: IBackendJobsProvider,
  ) { } // eslint-disable-line
  public async execute(/* {}: IRequest */): Promise<{ zipFile: string }> {
    const transactions = await this.transactionsRepository.findAll();
    const categories = await this.categoriesRepository.findAll();

    const backup = {
      categories: instanceToInstance(categories),
      transactions,
    };

    const backupString = JSON.stringify(backup, null, 2);

    const { tmpFolder, uploadsFolder } = uploadConfig;

    const folderName = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const folderPath = path.resolve(tmpFolder, folderName);

    await fs.mkdir(folderPath);

    await fs.mkdir(path.resolve(folderPath, 'bills'));

    await fs.writeFile(path.resolve(folderPath, 'data.json'), backupString);

    let bills: string[] = [];

    transactions.forEach(transaction => {
      bills = [...bills, ...transaction.bill];
    });

    await Promise.all(
      bills.map(async bill => {
        return fs.copyFile(
          path.resolve(uploadsFolder, bill),
          path.resolve(folderPath, 'bills', bill),
        );
      }),
    );

    const zipPath = path.resolve(tmpFolder, `${folderName}.zip`);

    await zip(folderPath, zipPath, {
      compression: COMPRESSION_LEVEL.high,
    });

    await fs.rm(folderPath, { recursive: true });

    await this.backendJobsProvider.addQueue('DeleteFile', {
      filePath: zipPath,
    });

    return { zipFile: `${folderName}.zip` };
  }
}
