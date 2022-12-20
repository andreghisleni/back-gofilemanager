import { inject, injectable } from 'tsyringe';

import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

// interface IRequest {}
interface IResponse {
  transactions: Transaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

@injectable()
export class FindAllTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {} // eslint-disable-line
  public async execute(/* {}: IRequest */): Promise<IResponse> {
    const transactions = await this.transactionsRepository.findAll();
    const balance = await this.transactionsRepository.getBalance();

    return { transactions, balance };
  }
}
