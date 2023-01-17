import { AppError } from '@shared/errors/AppError';

import { FakeFilesRepository } from '../repositories/fakes/FakeFilesRepository';
import { FindOneFileService } from './FindOneFileService';

let fakeFilesRepository: FakeFilesRepository;

let findOneFile: FindOneFileService;

describe('FindOneFile', () => {
  beforeEach(() => {
    fakeFilesRepository = new FakeFilesRepository();

    findOneFile = new FindOneFileService(fakeFilesRepository);
  });
  it('should be able find one file by id', async () => {
    const file = await fakeFilesRepository.create({
      name: 'File 1',
      description: 'File 1 description',
      fileName: 'file1.pdf',
      action_id: 'action_id',
      from_id: 'from_id',
      to_id: 'to_id',
      parent_id: 'parent_id',
    });

    const response = await findOneFile.execute({ id: file.id });
    expect(response).toHaveProperty('id');
    expect(response.id).toBe(file.id);
  });

  it('should not be able find one file by id', async () => {
    await expect(
      findOneFile.execute({ id: 'non-existing-file-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
