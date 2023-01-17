import { v4 as uuid } from 'uuid';

import { ICreateFileParentDTO } from '@modules/files/dtos/ICreateFileParentDTO';
import { FileParent } from '@modules/files/infra/typeorm/entities/FileParent';

import { IFileParentsRepository } from '../IFileParentsRepository';

export class FakeFileParentsRepository implements IFileParentsRepository {
  private fileParents: FileParent[] = [];

  public async connect(): Promise<void> { }// eslint-disable-line

  public async findById(id: string): Promise<FileParent | undefined> {
    const findFileParent = this.fileParents.find(
      fileParent => fileParent.id === id,
    );
    return findFileParent;
  }

  public async findByParentId(id: string): Promise<FileParent | undefined> {
    const findFileParent = this.fileParents.find(
      fileParent => fileParent.parent_id === id,
    );
    return findFileParent;
  }

  public async findByChildrenId(id: string): Promise<FileParent | undefined> {
    const findFileParent = this.fileParents.find(
      fileParent => fileParent.children_id === id,
    );
    return findFileParent;
  }

  public async findAll(): Promise<FileParent[]> {
    const findFileParents = this.fileParents;
    return findFileParents;
  }

  public async create(
    fileParentData: ICreateFileParentDTO,
  ): Promise<FileParent> {
    const fileParent = new FileParent();
    Object.assign(
      fileParent,
      {
        id: uuid(),
      },
      fileParentData,
    );

    this.fileParents.push(fileParent);

    return fileParent;
  }

  public async save(fileParent: FileParent): Promise<FileParent> {
    const findIndex = this.fileParents.findIndex(
      findFileParent => findFileParent.id === fileParent.id,
    );

    this.fileParents[findIndex] = fileParent;
    return fileParent;
  }
}
