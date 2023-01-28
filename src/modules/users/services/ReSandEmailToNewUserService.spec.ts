import { FakeMailProvider } from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { AppError } from '@shared/errors/AppError';

import { FakeHashProvider } from '../providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository';
import { ReSandEmailToNewUserService } from './ReSandEmailToNewUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;

let createUser: ReSandEmailToNewUserService;
describe('SandEmailToNewUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeMailProvider = new FakeMailProvider();
    createUser = new ReSandEmailToNewUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });
  it('should be able send email', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      first_password: true,
      password: '123456',
      user: 'johndoe',
    });

    const response = await createUser.execute({
      user_id: user.id,
    });
    expect(response).toHaveProperty('id');
  });
  it('should not be able to send email to inesisting user', async () => {
    await expect(
      createUser.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
