import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { FindAllTransactionsService } from './FindAllTransactionsService';

let fakeTransactionsRepository: FakeTransactionsRepository;

let findAllTransactions: FindAllTransactionsService;

describe('FindAllTransactions', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();

    findAllTransactions = new FindAllTransactionsService(
      fakeTransactionsRepository,
    );
  });
  it('should be able create a new transaction', async () => {
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

    const transactions = await findAllTransactions.execute();
    expect(transactions).toHaveLength(2);
  });
});
