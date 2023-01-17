import { ICreateFileParentDTO } from '../dtos/ICreateFileParentDTO';
import { FileParent } from '../infra/typeorm/entities/FileParent';

export interface IFileParentsRepository {
  connect(): Promise<void>;
  findById(id: string): Promise<FileParent | undefined>;
  findByParentId(id: string): Promise<FileParent | undefined>;
  findByChildrenId(id: string): Promise<FileParent | undefined>;
  findAll(): Promise<FileParent[]>;
  create(data: ICreateFileParentDTO): Promise<FileParent>;
  save(fileParent: FileParent): Promise<FileParent>;
}
