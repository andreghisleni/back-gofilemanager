import { Repository } from 'typeorm';
import { useDataSource } from 'typeorm-extension';

import { ICreateFileParentDTO } from '@modules/files/dtos/ICreateFileParentDTO';
import { IFileParentsRepository } from '@modules/files/repositories/IFileParentsRepository';

import { FileParent } from '../entities/FileParent';

export class FileParentsRepository implements IFileParentsRepository {
  private ormRepository: Repository<FileParent>;

  public async connect(): Promise<void> {
    this.ormRepository = (await useDataSource()).getRepository(FileParent);
  }

  public async findById(id: string): Promise<FileParent | undefined> {
    const findFileParent = await this.ormRepository.findOne({
      where: { id },
    });
    return findFileParent || undefined;
  }

  public async findByParentId(id: string): Promise<FileParent | undefined> {
    const findFileParent = await this.ormRepository.findOne({
      where: { parent_id: id },
    });
    return findFileParent || undefined;
  }

  public async findByChildrenId(id: string): Promise<FileParent | undefined> {
    const findFileParent = await this.ormRepository.findOne({
      where: { children_id: id },
    });
    return findFileParent || undefined;
  }

  public async findAll(): Promise<FileParent[]> {
    const findFileParents = await this.ormRepository.find();
    return findFileParents;
  }
  public async create({
    parent_id,
    children_id,
  }: ICreateFileParentDTO): Promise<FileParent> {
    const fileParent = this.ormRepository.create({
      parent_id,
      children_id,
    });

    await this.ormRepository.insert(fileParent);

    return fileParent;
  }

  public async save(fileParent: FileParent): Promise<FileParent> {
    return this.ormRepository.save(fileParent);
  }
}
