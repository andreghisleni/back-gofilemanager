import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

interface IRequest {
  transaction_id: string;
  billFilesPath: string[];
}

@injectable()
export class AddBillsInTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {} // eslint-disable-line
  public async execute({
    transaction_id,
    billFilesPath,
  }: IRequest): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findById(
      transaction_id,
    );

    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    const billFilesNames = await Promise.all(
      billFilesPath.map(async billFilePath => {
        const billFileName = await this.storageProvider.saveFile(billFilePath);
        return billFileName;
      }),
    );

    transaction.bill = billFilesNames;

    this.transactionsRepository.save(transaction);

    return transaction;
  }
}
