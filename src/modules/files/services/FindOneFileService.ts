import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { File } from '../infra/typeorm/entities/File';
import { IFilesRepository } from '../repositories/IFilesRepository';

interface IRequest {
  id: string;
}

@injectable()
export class FindOneFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) { } // eslint-disable-line
  public async execute({ id }: IRequest): Promise<File> {
    await this.filesRepository.connect();

    const file = await this.filesRepository.findById(id);

    if (!file) {
      throw new AppError('File not found');
    }

    return file;
  }
}
