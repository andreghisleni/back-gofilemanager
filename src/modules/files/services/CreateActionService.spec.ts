import { AppError } from '@shared/errors/AppError';

import { FakeActionsRepository } from '../repositories/fakes/FakeActionsRepository';
import { CreateActionService } from './CreateActionService';

let fakeActionsRepository: FakeActionsRepository;

let createAction: CreateActionService;
describe('CreateAction', () => {
  beforeEach(() => {
    fakeActionsRepository = new FakeActionsRepository();

    createAction = new CreateActionService(fakeActionsRepository);
  });
  it('should be able create a new action', async () => {
    const action = await createAction.execute({
      name: 'Action Test',
      finishedName: 'Action Test',
    });
    expect(action).toHaveProperty('id');
  });
  it('should not be able to create a new action with same name from another', async () => {
    await createAction.execute({
      name: 'Action Test',
      finishedName: 'Action Test',
    });
    await expect(
      createAction.execute({
        name: 'Action Test',
        finishedName: 'Action Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
