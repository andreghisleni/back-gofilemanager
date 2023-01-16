import { ICreateFileDTO } from '../dtos/ICreateFileDTO';
import { File } from '../infra/typeorm/entities/File';

export interface IFilesRepository {
  connect(): Promise<void>;
  findById(id: string): Promise<File | undefined>;
  findAll(): Promise<File[]>;
  create(data: ICreateFileDTO): Promise<File>;
  save(file: File): Promise<File>;
}
