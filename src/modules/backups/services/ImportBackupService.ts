import extract from 'extract-zip';
import fs from 'fs/promises';
import path from 'node:path';
import { inject, injectable } from 'tsyringe';

import { uploadConfig } from '@config/upload';

import { IBackendJobsProvider } from '@shared/container/providers/BackendJobs/models/IBackendJobsProvider';
import { AppError } from '@shared/errors/AppError';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import { ICategoriesRepository } from '@modules/transactions/repositories/ICategoriesRepository';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

import { Category } from '../../transactions/infra/typeorm/entities/Category';

interface IRequest {
  fileName: string;
}

interface IIFError {
  filePath?: string;
  folderPath?: string;
}

interface IData {
  categories: Category[];
  transactions: Transaction[];
}
@injectable()
export class ImportBackupService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('BackendJobsProvider')
    private backendJobsProvider: IBackendJobsProvider,
  ) { } // eslint-disable-line
  public async execute({ fileName }: IRequest): Promise<{ message: string }> {
    const { tmpFolder, uploadsFolder } = uploadConfig;

    const filePath = path.resolve(tmpFolder, fileName);

    const folderNameArray = fileName.split(`.`);
    folderNameArray.pop();
    const folderName = folderNameArray.join('.');

    const folderPath = path.resolve(tmpFolder, folderName);

    await extract(filePath, {
      dir: folderPath,
    });

    const dataFilePath = path.resolve(folderPath, 'data.json');

    if (!(await this.fileExists(dataFilePath))) {
      await this.ifError({
        filePath,
        folderPath,
      });
      throw new AppError('File Error');
    }

    const rawData = (await fs.readFile(dataFilePath)) as unknown;
    const data: IData = JSON.parse(rawData as string);

    if (!data.categories || !data.transactions) {
      await this.ifError({
        filePath,
        folderPath,
      });
      throw new AppError('File Error');
    }
    const transactions = await this.transactionsRepository.findAll();
    const categories = await this.categoriesRepository.findAll();

    if (transactions.length > 0 || categories.length > 0) {
      await this.ifError({
        filePath,
        folderPath,
      });
      throw new AppError('Data Base is not clean');
    }

    await Promise.all(
      data.categories.map(async category =>
        this.categoriesRepository.createExact(category),
      ),
    );

    await Promise.all(
      data.transactions.map(async transaction =>
        this.transactionsRepository.createExact(transaction),
      ),
    );

    let bills: string[] = [];

    data.transactions.forEach(transaction => {
      bills = [...bills, ...transaction.bill];
    });

    await Promise.all(
      bills.map(async bill => {
        return fs.copyFile(
          path.resolve(folderPath, 'bills', bill),
          path.resolve(uploadsFolder, bill),
        );
      }),
    );

    await this.ifError({
      filePath,
      folderPath,
    });

    return { message: `Upload completed successfully` };
  }

  private async ifError({ filePath, folderPath }: IIFError) {
    if (filePath) {
      await fs.rm(filePath);
    }

    if (folderPath) {
      await fs.rm(folderPath, { recursive: true });
    }
  }

  private async fileExists(path: string) {
    return !!(await fs.stat(path).catch(() => false));
  }
}
