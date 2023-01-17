import { FakeActionsRepository } from '../repositories/fakes/FakeActionsRepository';
import { FindAllActionsService } from './FindAllActionsService';

let fakeActionsRepository: FakeActionsRepository;

let findAllActions: FindAllActionsService;

describe('FindAllActions', () => {
  beforeEach(() => {
    fakeActionsRepository = new FakeActionsRepository();

    findAllActions = new FindAllActionsService(fakeActionsRepository);
  });
  it('should be able find all actions', async () => {
    await fakeActionsRepository.create({
      name: 'File Test',
      finishedName: 'File Test',
    });
    await fakeActionsRepository.create({
      name: 'File Test 2',
      finishedName: 'File Test 2',
    });

    const transactions = await findAllActions.execute();
    expect(transactions).toHaveLength(2);
  });
});
