import { v4 as uuid } from 'uuid';

import { ICreateAccountTransactionDTO } from '@modules/accounts/dtos/ICreateAccountTransactionDTO';
import { AccountTransaction } from '@modules/accounts/infra/typeorm/entities/AccountTransaction';

import { IAccountTransactionsRepository } from '../IAccountTransactionsRepository';

export class FakeAccountTransactionsRepository
  // eslint-disable-next-line prettier/prettier
  implements IAccountTransactionsRepository {
  private accountTransactions: AccountTransaction[] = [];

  public async findById(id: string): Promise<AccountTransaction | undefined> {
    const findAccountTransactions = this.accountTransactions.find(
      accountTransactions => accountTransactions.id === id,
    );
    return findAccountTransactions;
  }

  public async findAll(): Promise<AccountTransaction[]> {
    const findAccountTransactions = this.accountTransactions;
    return findAccountTransactions;
  }

  // public async getBalance(): Promise<IBalance> {
  //   const { accountTransactions } = this;

  //   const income = accountTransactions.reduce((acumulator, item) => {
  //     if (item.type === 'income' || item.type === 'initvalue')
  //       return acumulator + item.value;
  //     return acumulator + 0;
  //   }, 0);
  //   const outcome = accountTransactions.reduce((acumulator, item) => {
  //     if (item.type === 'outcome') return acumulator + item.value;
  //     return acumulator + 0;
  //   }, 0);
  //   const total = income - outcome;

  //   return {
  //     income,
  //     outcome,
  //     total,
  //   };
  // }

  public async create(
    accountTransactionsData: ICreateAccountTransactionDTO,
  ): Promise<AccountTransaction> {
    const accountTransactions = new AccountTransaction();
    Object.assign(
      accountTransactions,
      {
        id: uuid(),
      },
      accountTransactionsData,
    );

    this.accountTransactions.push(accountTransactions);

    return accountTransactions;
  }

  public async save(
    accountTransaction: AccountTransaction,
  ): Promise<AccountTransaction> {
    const findIndex = this.accountTransactions.findIndex(
      findAccountTransactions =>
        findAccountTransactions.id === accountTransaction.id,
    );

    this.accountTransactions[findIndex] = accountTransaction;
    return accountTransaction;
  }
}
