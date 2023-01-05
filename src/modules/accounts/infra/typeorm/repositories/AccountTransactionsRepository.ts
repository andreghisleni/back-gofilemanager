import { Repository, getRepository } from 'typeorm';

import { ICreateAccountTransactionDTO } from '@modules/accounts/dtos/ICreateAccountTransactionDTO';
import { IAccountTransactionsRepository } from '@modules/accounts/repositories/IAccountTransactionsRepository';

import { AccountTransaction } from '../entities/AccountTransaction';

export class AccountTransactionsRepository
  // eslint-disable-next-line prettier/prettier
  implements IAccountTransactionsRepository {
  private ormRepository: Repository<AccountTransaction>;

  constructor() {
    this.ormRepository = getRepository(AccountTransaction);
  }

  public async findById(id: string): Promise<AccountTransaction | undefined> {
    const findAccountTransaction = await this.ormRepository.findOne({
      where: { id },
    });
    return findAccountTransaction;
  }

  public async findAll(): Promise<AccountTransaction[]> {
    const findAccountTransactions = await this.ormRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
    return findAccountTransactions;
  }
  // public async getBalance(): Promise<IBalance> {
  //   const accountTraAccountTransactions = await this.ormRepository.find();

  //   const income = accountTraAccountTransactions.reduce((acumulator, item) => {
  //     if (item.type === 'income' || item.type === 'initvalue')
  //       return acumulator + item.value;
  //     return acumulator + 0;
  //   }, 0);
  //   const outcome = accountTraAccountTransactions.reduce((acumulator, item) => {
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
  public async create({
    account_id,
    transaction_id,
    value,
  }: ICreateAccountTransactionDTO): Promise<AccountTransaction> {
    const accountTraAccountTransaction = this.ormRepository.create({
      account_id,
      transaction_id,
      value,
    });

    await this.ormRepository.save(accountTraAccountTransaction);

    return accountTraAccountTransaction;
  }

  public async save(
    accountTraAccountTransaction: AccountTransaction,
  ): Promise<AccountTransaction> {
    return this.ormRepository.save(accountTraAccountTransaction);
  }
}
