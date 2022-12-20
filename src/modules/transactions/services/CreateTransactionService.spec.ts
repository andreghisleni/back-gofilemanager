import { AppError } from '@shared/errors/AppError';

import { FakeCategoriesRepository } from '../repositories/fakes/FakeCategoriesRepository';
import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { CreateTransactionService } from './CreateTransactionService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeTransactionsRepository: FakeTransactionsRepository;

let createTransaction: CreateTransactionService;
describe('CreateTransaction', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeTransactionsRepository = new FakeTransactionsRepository();

    createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeCategoriesRepository,
    );
  });
  it('should be able create a new transaction', async () => {
    const category = await fakeCategoriesRepository.create({
      title: 'Category Test',
    });

    const transaction = await createTransaction.execute({
      title: 'Transaction Test',
      value: 100,
      type: 'income',
      category_id: category.id,
      description: 'Description Test',
    });
    expect(transaction).toHaveProperty('id');
  });
  it('should not be able to create a new transaction with invalid type', async () => {
    await expect(
      createTransaction.execute({
        title: 'Transaction Test',
        value: 100,
        type: 'invalid',
        category_id: 'non-existing-category',
        description: 'Description Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new transaction with out category', async () => {
    await expect(
      createTransaction.execute({
        title: 'Transaction Test',
        value: 100,
        type: 'income',
        category_id: 'non-existing-category',
        description: 'Description Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new transaction with type outcome if don`t have funds', async () => {
    await expect(
      createTransaction.execute({
        title: 'Transaction Test',
        value: 100,
        type: 'outcome',
        category_id: 'non-existing-category',
        description: 'Description Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
