import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

import { Account } from '../infra/typeorm/entities/Account';
import { IAccountsRepository } from '../repositories/IAccountsRepository';
import { IAccountTransactionsRepository } from '../repositories/IAccountTransactionsRepository';

interface IRequest {
  name: string;
  description: string;
}
@injectable()
export class CreateAccountService {
  constructor(
    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,

    @inject('AccountTransactionsRepository')
    private accountTransactionsRepository: IAccountTransactionsRepository,

    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) { } // eslint-disable-line

  public async execute({ name, description }: IRequest): Promise<Account> {
    const checkAccountExists = await this.accountsRepository.findByName(name);

    const checkAllAccounts = await this.accountsRepository.findAll();

    const totalAccounts = checkAllAccounts.length;

    if (checkAccountExists) {
      throw new AppError('Account already exists');
    }
    const account = await this.accountsRepository.create({
      name,
      description,
    });

    if (totalAccounts === 0) {
      const transactions = await this.transactionsRepository.findAll();

      if (transactions.length > 0) {
        await Promise.all(
          transactions.map(async transaction =>
            this.accountTransactionsRepository.create({
              account_id: account.id,
              transaction_id: transaction.id,
              value:
                transaction.type === 'outcome'
                  ? -transaction.value
                  : transaction.value,
            }),
          ),
        );
      }
    }

    return account;
  }
}
