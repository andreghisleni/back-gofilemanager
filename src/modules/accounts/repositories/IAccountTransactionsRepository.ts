import { ICreateAccountTransactionDTO } from '../dtos/ICreateAccountTransactionDTO';
import { AccountTransaction } from '../infra/typeorm/entities/AccountTransaction';

export interface IAccountTransactionsRepository {
  findById(id: string): Promise<AccountTransaction | undefined>;
  findAll(): Promise<AccountTransaction[]>;
  create(data: ICreateAccountTransactionDTO): Promise<AccountTransaction>;
  save(transaction: AccountTransaction): Promise<AccountTransaction>;
  // getBalance(): Promise<IBalance>;
}
