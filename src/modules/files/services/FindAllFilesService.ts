import { inject, injectable } from 'tsyringe';

import { File } from '../infra/typeorm/entities/File';
import { IFilesRepository } from '../repositories/IFilesRepository';

// interface IRequest {}

@injectable()
export class FindAllFilesService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) { } // eslint-disable-line
  public async execute(/* {}: IRequest */): Promise<File[]> {
    await this.filesRepository.connect();

    const files = await this.filesRepository.findAll();

    return files;
  }
}
