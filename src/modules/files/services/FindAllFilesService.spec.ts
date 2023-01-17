import { FakeFilesRepository } from '../repositories/fakes/FakeFilesRepository';
import { FindAllFilesService } from './FindAllFilesService';

let fakeFilesRepository: FakeFilesRepository;

let findAllFiles: FindAllFilesService;

describe('FindAllFiles', () => {
  beforeEach(() => {
    fakeFilesRepository = new FakeFilesRepository();

    findAllFiles = new FindAllFilesService(fakeFilesRepository);
  });
  it('should be able create a new file', async () => {
    await fakeFilesRepository.create({
      name: 'File 1',
      description: 'File 1 description',
      fileName: 'file1.pdf',
      action_id: 'action_id',
      from_id: 'from_id',
      to_id: 'to_id',
      parent_id: 'parent_id',
    });
    await fakeFilesRepository.create({
      name: 'File 2',
      description: 'File 2 description',
      fileName: 'file2.pdf',
      action_id: 'action_id',
      from_id: 'from_id',
      to_id: 'to_id',
      parent_id: 'parent_id',
    });

    const files = await findAllFiles.execute();
    expect(files).toHaveLength(2);
  });
});
