import { FakeAccountsRepository } from '../repositories/fakes/FakeAccountsRepository';
import { FindAllAccountsService } from './FindAllAccountsService';

let fakeAccountsRepository: FakeAccountsRepository;

let findAllAccounts: FindAllAccountsService;

describe('FindAllAccounts', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();

    findAllAccounts = new FindAllAccountsService(fakeAccountsRepository);
  });
  it('should be able create a new account', async () => {
    await fakeAccountsRepository.create({
      name: 'Account Test',
      description: 'Account Test',
    });
    await fakeAccountsRepository.create({
      name: 'Account Test',
      description: 'Account Test',
    });

    const accounts = await findAllAccounts.execute();
    expect(accounts).toHaveLength(2);
  });
});
