import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { Account } from '@modules/accounts/infra/typeorm/entities/Account';
import { IAccountsRepository } from '@modules/accounts/repositories/IAccountsRepository';
import { IAccountTransactionsRepository } from '@modules/accounts/repositories/IAccountTransactionsRepository';

import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

interface IRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome' | 'initvalue' | 'transfer' | string;
  category_id: string;
  description: string;
  accounts: {
    account_id: string;
    value: number;
  }[];
}

@injectable()
export class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,

    @inject('AccountsRepository')
    private accountsRepository: IAccountsRepository,

    @inject('AccountTransactionsRepository')
    private accountTransactionsRepository: IAccountTransactionsRepository,
  ) { } // eslint-disable-line
  public async execute({
    title,
    value,
    type,
    category_id,
    description,
    accounts,
  }: IRequest): Promise<Transaction> {
    if (
      type !== 'income' &&
      type !== 'outcome' &&
      type !== 'initvalue' &&
      type !== 'transfer'
    ) {
      throw new AppError('Invalid type');
    }
    const findAccounts = await Promise.all(
      accounts.map(async account =>
        this.accountsRepository.findById(account.account_id),
      ),
    );

    if (findAccounts.includes(undefined)) {
      throw new AppError('Accounts not found');
    }
    if (type === 'outcome') {
      const { total: balance } = await this.transactionsRepository.getBalance();

      if (balance < value) {
        throw new AppError('Insufficient Funds');
      }

      if (accounts.length === 0) {
        if ((findAccounts as Account[])[0].balance < value) {
          throw new AppError('Insufficient Funds in Account');
        }
      } else if (accounts.length > 1) {
        const changeBalance = (findAccounts as Account[]).map(
          (account, i) => account.balance >= accounts[i].value || undefined,
        );
        if (!changeBalance.includes(undefined)) {
          throw new AppError('Insufficient Funds in one Account');
        }
      }
    }

    if (type === 'transfer') {
      if (accounts.length === 0) {
        throw new AppError('Accounts not found');
      }
      if (accounts.length !== 2) {
        throw new AppError('Need two accounts');
      }
      const { total: balance } = await this.transactionsRepository.getBalance();

      if (balance < value) {
        throw new AppError('Insufficient Funds');
      }

      const findAccount = await this.accountsRepository.findById(
        accounts[0].account_id,
      );
      if (!findAccount) {
        throw new AppError('Account not found');
      }

      const findAccount2 = await this.accountsRepository.findById(
        accounts[1].account_id,
      );
      if (!findAccount2) {
        throw new AppError('Account not found');
      }

      if (findAccount.balance < value) {
        throw new AppError('Insufficient Funds in Account');
      }
    }
    if (type === 'income') {
      if (accounts.length === 0) {
        throw new AppError('Accounts not found');
      }
      const totalValue = accounts.reduce(
        (acc, account) => acc + account.value,
        0,
      );
      if (value !== totalValue) {
        throw new AppError('Value is not equal to the sum of the accounts');
      }
    }

    const category = await this.categoriesRepository.findById(category_id);
    if (!category) {
      throw new AppError('Category not found');
    }

    if (type === 'transfer') {
      const transaction = await this.transactionsRepository.create({
        title,
        value,
        type,
        description,
        bill: [],
        category_id,
      });

      await Promise.all([
        this.accountTransactionsRepository.create({
          account_id: accounts[0].account_id,
          transaction_id: transaction.id,
          value: -value,
        }),
        this.accountTransactionsRepository.create({
          account_id: accounts[1].account_id,
          transaction_id: transaction.id,
          value,
        }),
      ]);

      return transaction;
    }

    const transaction = await this.transactionsRepository.create({
      title,
      value,
      type,
      description,
      bill: [],
      category_id,
    });

    await Promise.all(
      accounts.map(async account =>
        this.accountTransactionsRepository.create({
          account_id: account.account_id,
          transaction_id: transaction.id,
          value: type === 'outcome' ? -account.value : account.value,
        }),
      ),
    );
    return transaction;
  }
}
