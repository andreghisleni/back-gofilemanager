import { ICreateAccountDTO } from '../dtos/ICreateAccountDTO';
import { Account } from '../infra/typeorm/entities/Account';

export interface IAccountsRepository {
  findById(id: string): Promise<Account | undefined>;
  findByName(name: string): Promise<Account | undefined>;
  findAll(): Promise<Account[]>;
  create(data: ICreateAccountDTO): Promise<Account>;
  save(account: Account): Promise<Account>;
}
