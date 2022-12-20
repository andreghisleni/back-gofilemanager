import { v4 as uuid } from 'uuid';

import { IBalance } from '@modules/transactions/dtos/IBalanceDTO';
import { ICreateTransactionDTO } from '@modules/transactions/dtos/ICreateTransactionDTO';
import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';

import { ICreateExactTransactionDTO } from '../../dtos/ICreateTransactionDTO';
import { ITransactionsRepository } from '../ITransactionsRepository';

export class FakeTransactionsRepository implements ITransactionsRepository {
  private transactions: Transaction[] = [];

  public async findById(id: string): Promise<Transaction | undefined> {
    const findTransaction = this.transactions.find(
      transaction => transaction.id === id,
    );
    return findTransaction;
  }

  public async findAll(): Promise<Transaction[]> {
    const findTransactions = this.transactions;
    return findTransactions;
  }

  public async getBalance(): Promise<IBalance> {
    const { transactions } = this;

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

  public async create(
    transactionData: ICreateTransactionDTO,
  ): Promise<Transaction> {
    const transaction = new Transaction();
    Object.assign(
      transaction,
      {
        id: uuid(),
      },
      transactionData,
    );

    this.transactions.push(transaction);

    return transaction;
  }

  public async createExact(
    transactionData: ICreateExactTransactionDTO,
  ): Promise<Transaction> {
    const transaction = new Transaction();
    Object.assign(transaction, transactionData);

    this.transactions.push(transaction);

    return transaction;
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    const findIndex = this.transactions.findIndex(
      findTransaction => findTransaction.id === transaction.id,
    );

    this.transactions[findIndex] = transaction;
    return transaction;
  }
}
