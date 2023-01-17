import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { FakeMailProvider } from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { FakeUsersRepository } from '../../users/repositories/fakes/FakeUsersRepository';
import { FakeActionsRepository } from '../repositories/fakes/FakeActionsRepository';
import { FakeFileParentsRepository } from '../repositories/fakes/FakeFileParentsRepository';
import { FakeFilesRepository } from '../repositories/fakes/FakeFilesRepository';
import { CreateFileService } from './CreateFileService';

let fakeActionsRepository: FakeActionsRepository;
let fakeFilesRepository: FakeFilesRepository;
let fakeFileParentsRepository: FakeFileParentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeMailProvider: FakeMailProvider;

let createFile: CreateFileService;
describe('CreateFile', () => {
  beforeEach(() => {
    fakeActionsRepository = new FakeActionsRepository();
    fakeFilesRepository = new FakeFilesRepository();
    fakeFileParentsRepository = new FakeFileParentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeMailProvider = new FakeMailProvider();

    createFile = new CreateFileService(
      fakeFilesRepository,
      fakeActionsRepository,
      fakeFileParentsRepository,
      fakeUsersRepository,
      fakeStorageProvider,
      fakeMailProvider,
    );
  });
  it('should be able create a new file', async () => {
    const action = await fakeActionsRepository.create({
      name: 'Action Test',
      finishedName: 'Action Test',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
      first_password: false,
      user: 'john.doe',
    });
    const file = await createFile.execute({
      name: 'File Test',
      description: 'Description Test',
      fileFileName: 'file-test.pdf',
      action_id: action.id,
      from_id: user.id,
      to_id: user.id,
      parent_id: '',
    });
    expect(file).toHaveProperty('id');
  });
  it('should be able create a children file', async () => {
    const action = await fakeActionsRepository.create({
      name: 'Action Test',
      finishedName: 'Action Test',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
      first_password: false,
      user: 'john.doe',
    });
    const parent_file = await createFile.execute({
      name: 'File Test',
      description: 'Description Test',
      fileFileName: 'file-test.pdf',
      action_id: action.id,
      from_id: user.id,
      to_id: user.id,
      parent_id: '',
    });
    const file = await createFile.execute({
      name: 'File Test',
      description: 'Description Test',
      fileFileName: 'file-test.pdf',
      action_id: action.id,
      from_id: user.id,
      to_id: user.id,
      parent_id: parent_file.id,
    });

    const verifyFileParent = await fakeFileParentsRepository.findByParentId(
      parent_file.id,
    );
    expect(file).toHaveProperty('id');
    expect(verifyFileParent).toHaveProperty('id');
    expect(verifyFileParent?.parent_id).toBe(parent_file.id);
    expect(verifyFileParent?.children_id).toBe(file.id);
  });
  it('should not be able to create a new file with invalid action', async () => {
    await expect(
      createFile.execute({
        name: 'File Test',
        description: 'Description Test',
        fileFileName: 'file-test.pdf',
        action_id: 'non-existing-action',
        from_id: 'non-existing-user',
        to_id: 'non-existing-user',
        parent_id: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new file with out from', async () => {
    const action = await fakeActionsRepository.create({
      name: 'Action Test',
      finishedName: 'Action Test',
    });
    await expect(
      createFile.execute({
        name: 'File Test',
        description: 'Description Test',
        fileFileName: 'file-test.pdf',
        action_id: action.id,
        from_id: 'non-existing-user',
        to_id: 'non-existing-user',
        parent_id: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new file with out to', async () => {
    const action = await fakeActionsRepository.create({
      name: 'Action Test',
      finishedName: 'Action Test',
    });
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
      first_password: false,
      user: 'john.doe',
    });
    await expect(
      createFile.execute({
        name: 'File Test',
        description: 'Description Test',
        fileFileName: 'file-test.pdf',
        action_id: action.id,
        from_id: user.id,
        to_id: 'non-existing-user',
        parent_id: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create a new file with invalid parent_id', async () => {
    const action = await fakeActionsRepository.create({
      name: 'Action Test',
      finishedName: 'Action Test',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
      first_password: false,
      user: 'john.doe',
    });
    await expect(
      createFile.execute({
        name: 'File Test',
        description: 'Description Test',
        fileFileName: 'file-test.pdf',
        action_id: action.id,
        from_id: user.id,
        to_id: user.id,
        parent_id: 'non-existing-parent',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
