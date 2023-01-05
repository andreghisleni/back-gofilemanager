import { v4 as uuid } from 'uuid';

import { ICreateAccountDTO } from '@modules/accounts/dtos/ICreateAccountDTO';
import { Account } from '@modules/accounts/infra/typeorm/entities/Account';

import { IAccountsRepository } from '../IAccountsRepository';

export class FakeAccountsRepository implements IAccountsRepository {
  private accounts: Account[] = [];

  public async findById(id: string): Promise<Account | undefined> {
    const findAccount = this.accounts.find(account => account.id === id);
    return findAccount;
  }
  public async findByName(name: string): Promise<Account | undefined> {
    const findAccount = this.accounts.find(account => account.name === name);
    return findAccount;
  }

  public async findAll(): Promise<Account[]> {
    const findCategories = this.accounts;
    return findCategories;
  }

  public async create(accountData: ICreateAccountDTO): Promise<Account> {
    const account = new Account();
    Object.assign(
      account,
      {
        id: uuid(),
      },
      accountData,
    );

    this.accounts.push(account);

    return account;
  }

  public async save(account: Account): Promise<Account> {
    const findIndex = this.accounts.findIndex(
      findAccount => findAccount.id === account.id,
    );

    this.accounts[findIndex] = account;
    return account;
  }
}
