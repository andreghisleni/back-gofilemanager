import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

interface IRequest {
  title: string;
  value: number;
  type: string;
  category_id: string;
  description: string;
}

@injectable()
export class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {} // eslint-disable-line
  public async execute({
    title,
    value,
    type,
    category_id,
    description,
  }: IRequest): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome' && type !== 'initvalue') {
      throw new AppError('Invalid type');
    }
    if (type === 'outcome') {
      const { total: balance } = await this.transactionsRepository.getBalance();

      if (balance < value) {
        throw new AppError('Insufficient Funds');
      }
    }

    const category = await this.categoriesRepository.findById(category_id);
    if (!category) {
      throw new AppError('Category not found');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      description,
      bill: [],
      category_id,
    });
    return transaction;
  }
}
