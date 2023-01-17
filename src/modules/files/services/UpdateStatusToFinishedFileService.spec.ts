import { AppError } from '@shared/errors/AppError';

import { FakeFilesRepository } from '../repositories/fakes/FakeFilesRepository';
import { UpdateStatusToFinishedFileService } from './UpdateStatusToFinishedFileService';

let fakeFilesRepository: FakeFilesRepository;

let updateStatusToFinishedFile: UpdateStatusToFinishedFileService;

describe('UpdateStatusToFinishedFile', () => {
  beforeEach(() => {
    fakeFilesRepository = new FakeFilesRepository();

    updateStatusToFinishedFile = new UpdateStatusToFinishedFileService(
      fakeFilesRepository,
    );
  });
  it('should be able update status to finished', async () => {
    const file = await fakeFilesRepository.create({
      name: 'File 1',
      description: 'File 1 description',
      fileName: 'file1.pdf',
      action_id: 'action_id',
      from_id: 'from_id',
      to_id: 'to_id',
      parent_id: 'parent_id',
    });

    const response = await updateStatusToFinishedFile.execute({ id: file.id });
    expect(response).toHaveProperty('id');
    expect(response.finished).toBe(true);
  });

  it('should not be able update status to finished', async () => {
    await expect(
      updateStatusToFinishedFile.execute({ id: 'non-existing-file-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
