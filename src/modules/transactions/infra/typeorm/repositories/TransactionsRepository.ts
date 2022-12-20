import { Repository, getRepository } from 'typeorm';

import { IBalance } from '@modules/transactions/dtos/IBalanceDTO';
import { ICreateTransactionDTO } from '@modules/transactions/dtos/ICreateTransactionDTO';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

import { ICreateExactTransactionDTO } from '../../../dtos/ICreateTransactionDTO';
import { Transaction } from '../entities/Transaction';

export class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async findById(id: string): Promise<Transaction | undefined> {
    const findTransaction = await this.ormRepository.findOne({
      where: { id },
    });
    return findTransaction;
  }

  public async findAll(): Promise<Transaction[]> {
    const findTransactions = await this.ormRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
    return findTransactions;
  }
  public async getBalance(): Promise<IBalance> {
    const transactions = await this.ormRepository.find();

    const income = transactions.reduce((acumulator, item) => {
      if (item.type === 'income' || item.type === 'initvalue')
        return acumulator + item.value;
      return acumulator + 0;
    }, 0);
    const outcome = transactions.reduce((acumulator, item) => {
      if (item.type === 'outcome') return acumulator + item.value;
      return acumulator + 0;
    }, 0);
    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
  public async create({
    title,
    type,
    value,
    category_id,
    bill,
    description,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      title,
      type,
      value,
      category_id,
      bill,
      description,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }
  public async createExact({
    id,
    title,
    type,
    value,
    category_id,
    bill,
    description,
    created_at,
    updated_at,
  }: ICreateExactTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      id,
      title,
      type,
      value,
      category_id,
      bill,
      description,
      created_at,
      updated_at,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    return this.ormRepository.save(transaction);
  }
}
