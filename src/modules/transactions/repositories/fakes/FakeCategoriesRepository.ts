import { v4 as uuid } from 'uuid';

import { ICreateCategoryDTO } from '@modules/transactions/dtos/ICreateCategoryDTO';
import { Category } from '@modules/transactions/infra/typeorm/entities/Category';

import { ICreateExactCategoryDTO } from '../../dtos/ICreateCategoryDTO';
import { ICategoriesRepository } from '../ICategoriesRepository';

export class FakeCategoriesRepository implements ICategoriesRepository {
  private transactions: Category[] = [];

  public async findById(id: string): Promise<Category | undefined> {
    const findCategory = this.transactions.find(
      transaction => transaction.id === id,
    );
    return findCategory;
  }

  public async findByTitle(title: string): Promise<Category | undefined> {
    const findCategory = this.transactions.find(
      transaction => transaction.title === title,
    );
    return findCategory;
  }

  public async findAll(): Promise<Category[]> {
    const findCategories = this.transactions;
    return findCategories;
  }

  public async create(transactionData: ICreateCategoryDTO): Promise<Category> {
    const transaction = new Category();
    Object.assign(
      transaction,
      {
        id: uuid(),
      },
      transactionData,
    );

    this.transactions.push(transaction);

    return transaction;
  }

  public async createExact(
    transactionData: ICreateExactCategoryDTO,
  ): Promise<Category> {
    const transaction = new Category();
    Object.assign(
      transaction,

      transactionData,
    );

    this.transactions.push(transaction);

    return transaction;
  }

  public async save(transaction: Category): Promise<Category> {
    const findIndex = this.transactions.findIndex(
      findCategory => findCategory.id === transaction.id,
    );

    this.transactions[findIndex] = transaction;
    return transaction;
  }
}
