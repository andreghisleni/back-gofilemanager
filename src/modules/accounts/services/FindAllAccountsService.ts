import { inject, injectable } from 'tsyringe';

import { IAccountsRepository } from '@modules/accounts/repositories/IAccountsRepository';

import { Account } from '../infra/typeorm/entities/Account';

// interface IRequest {}

@injectable()
export class FindAllAccountsService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,
  ) { } // eslint-disable-line
  public async execute(/* {}: IRequest */): Promise<Account[]> {
    const accounts = await this.accountsRepository.findAll();

    return accounts;
  }
}
