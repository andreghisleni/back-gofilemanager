import { v4 as uuid } from 'uuid';

import { ICreateFileDTO } from '@modules/files/dtos/ICreateFileDTO';
import { File } from '@modules/files/infra/typeorm/entities/File';

import { IFilesRepository } from '../IFilesRepository';

export class FakeFilesRepository implements IFilesRepository {
  private files: File[] = [];

  public async connect(): Promise<void> { } // eslint-disable-line

  public async findById(id: string): Promise<File | undefined> {
    const findFile = this.files.find(file => file.id === id);
    return findFile;
  }

  public async findAll(): Promise<File[]> {
    const findFiles = this.files;
    return findFiles;
  }

  public async create(fileData: ICreateFileDTO): Promise<File> {
    const file = new File();
    Object.assign(
      file,
      {
        id: uuid(),
      },
      fileData,
    );

    this.files.push(file);

    return file;
  }

  public async save(file: File): Promise<File> {
    const findIndex = this.files.findIndex(findFile => findFile.id === file.id);

    this.files[findIndex] = file;
    return file;
  }
}
