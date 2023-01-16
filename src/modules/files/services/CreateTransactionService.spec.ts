import { AppError } from '@shared/errors/AppError';

import { FakeAccountsRepository } from '../../accounts/repositories/fakes/FakeAccountsRepository';
import { FakeAccountTransactionsRepository } from '../../accounts/repositories/fakes/FakeTransactionsRepository';
import { FakeCategoriesRepository } from '../repositories/fakes/FakeCategoriesRepository';
import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { CreateTransactionService } from './CreateTransactionService';

let fakeCategoriesRepository: FakeCategoriesRepository;
let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeAccountsRepository: FakeAccountsRepository;
let fakeAccountTransactionsRepository: FakeAccountTransactionsRepository;

let createTransaction: CreateTransactionService;
describe('CreateTransaction', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeAccountTransactionsRepository = new FakeAccountTransactionsRepository();

    createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeCategoriesRepository,
      fakeAccountsRepository,
      fakeAccountTransactionsRepository,
    );
  });
  it('should be able create a new transaction', async () => {
    const category = await fakeCategoriesRepository.create({
      title: 'Category Test',
    });

    const account = await fakeAccountsRepository.create({
      name: 'Account Test',
      description: 'Account Test',
    });
    const transaction = await createTransaction.execute({
      title: 'Transaction Test',
      value: 100,
      type: 'income',
      category_id: category.id,
      description: 'Description Test',
      accounts: [
        {
          account_id: account.id,
          value: 100,
        },
      ],
    });
    expect(transaction).toHaveProperty('id');
  });
  it('should not be able to create a new transaction with invalid type', async () => {
    await expect(
      createTransaction.execute({
        title: 'Transaction Test',
        value: 100,
        type: 'invalid-type',
        category_id: 'non-existing-category',
        description: 'Description Test',
        accounts: [
          {
            account_id: 'non-existing-account',
            value: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new transaction with out category', async () => {
    const account = await fakeAccountsRepository.create({
      name: 'Account Test',
      description: 'Account Test',
    });
    await expect(
      createTransaction.execute({
        title: 'Transaction Test',
        value: 100,
        type: 'income',
        category_id: 'non-existing-category',
        description: 'Description Test',
        accounts: [
          {
            account_id: account.id,
            value: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new transaction with type outcome if don`t have funds', async () => {
    const account = await fakeAccountsRepository.create({
      name: 'Account Test',
      description: 'Account Test',
    });
    await expect(
      createTransaction.execute({
        title: 'Transaction Test',
        value: 100,
        type: 'outcome',
        category_id: 'non-existing-category',
        description: 'Description Test',
        accounts: [
          {
            account_id: account.id,
            value: 100,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
