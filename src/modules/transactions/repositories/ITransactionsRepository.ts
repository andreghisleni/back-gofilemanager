import { IBalance } from '../dtos/IBalanceDTO';
import { ICreateTransactionDTO } from '../dtos/ICreateTransactionDTO';
import { ICreateExactTransactionDTO } from '../dtos/ICreateTransactionDTO';
import { Transaction } from '../infra/typeorm/entities/Transaction';

export interface ITransactionsRepository {
  findById(id: string): Promise<Transaction | undefined>;
  findAll(): Promise<Transaction[]>;
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  createExact(data: ICreateExactTransactionDTO): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
  getBalance(): Promise<IBalance>;
}
