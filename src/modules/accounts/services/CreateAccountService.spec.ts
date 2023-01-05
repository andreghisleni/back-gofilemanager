import { AppError } from '@shared/errors/AppError';

import { FakeTransactionsRepository } from '../../transactions/repositories/fakes/FakeTransactionsRepository';
import { FakeAccountsRepository } from '../repositories/fakes/FakeAccountsRepository';
import { FakeAccountTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { CreateAccountService } from './CreateAccountService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeAccountTransactionsRepository: FakeAccountTransactionsRepository;
let fakeTransactionsRepository: FakeTransactionsRepository;

let createAccount: CreateAccountService;
describe('CreateAccount', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeAccountTransactionsRepository = new FakeAccountTransactionsRepository();
    fakeTransactionsRepository = new FakeTransactionsRepository();

    createAccount = new CreateAccountService(
      fakeAccountsRepository,
      fakeAccountTransactionsRepository,
      fakeTransactionsRepository,
    );
  });
  it('should be able create a new account', async () => {
    const account = await createAccount.execute({
      name: 'Account Test',
      description: 'Account Test',
    });
    expect(account).toHaveProperty('id');
  });
  it('should be able create a new account if there are transactions without account', async () => {
    await fakeTransactionsRepository.create({
      title: 'Transaction Test',
      value: 100,
      type: 'income',
      category_id: 'category_id',
      description: 'Description Test',
      bill: [],
    });
    await fakeTransactionsRepository.create({
      title: 'Transaction Test',
      value: 100,
      type: 'income',
      category_id: 'category_id',
      description: 'Description Test',
      bill: [],
    });

    const account = await createAccount.execute({
      name: 'Account Test',
      description: 'Account Test',
    });

    const accountTransactions =
      await fakeAccountTransactionsRepository.findAll();

    expect(accountTransactions).toHaveLength(2);
    expect(account).toHaveProperty('id');
  });
  it('should not be able to create a new account with same title from another', async () => {
    await createAccount.execute({
      name: 'Account Test',
      description: 'Account Test',
    });
    await expect(
      createAccount.execute({
        name: 'Account Test',
        description: 'Account Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
