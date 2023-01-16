import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { File } from '../infra/typeorm/entities/File';
import { IFilesRepository } from '../repositories/IFilesRepository';

interface IRequest {
  id: string;
}
@injectable()
export class UpdateStatusToFinishedFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) { } // eslint-disable-line

  public async execute({ id }: IRequest): Promise<File> {
    await this.filesRepository.connect();

    const checkFileExists = await this.filesRepository.findById(id);

    if (!checkFileExists) {
      throw new AppError('File does not exists');
    }

    checkFileExists.finished = true;
    await this.filesRepository.save(checkFileExists);

    return checkFileExists;
  }
}
