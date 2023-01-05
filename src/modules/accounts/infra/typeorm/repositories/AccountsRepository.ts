import { Repository, getRepository } from 'typeorm';

import { ICreateAccountDTO } from '@modules/accounts/dtos/ICreateAccountDTO';
import { IAccountsRepository } from '@modules/accounts/repositories/IAccountsRepository';

import { Account } from '../entities/Account';

export class AccountsRepository implements IAccountsRepository {
  private ormRepository: Repository<Account>;

  constructor() {
    this.ormRepository = getRepository(Account);
  }

  public async findById(id: string): Promise<Account | undefined> {
    const findAccount = await this.ormRepository.findOne({
      where: { id },
    });
    return findAccount;
  }

  public async findByName(name: string): Promise<Account | undefined> {
    const findAccount = await this.ormRepository.findOne({
      where: { name },
    });
    return findAccount;
  }

  public async findAll(): Promise<Account[]> {
    const findCategories = await this.ormRepository.find();
    return findCategories;
  }
  public async create({
    name,
    description,
  }: ICreateAccountDTO): Promise<Account> {
    const accountAccount = this.ormRepository.create({
      name,
      description,
    });

    await this.ormRepository.save(accountAccount);

    return accountAccount;
  }

  public async save(account: Account): Promise<Account> {
    return this.ormRepository.save(account);
  }
}
