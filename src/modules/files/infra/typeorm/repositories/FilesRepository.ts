import { Repository, IsNull } from 'typeorm';
import { useDataSource } from 'typeorm-extension';

import { ICreateFileDTO } from '@modules/files/dtos/ICreateFileDTO';
import { IFilesRepository } from '@modules/files/repositories/IFilesRepository';

import { File } from '../entities/File';

export class FilesRepository implements IFilesRepository {
  private ormRepository: Repository<File>;

  public async connect(): Promise<void> {
    this.ormRepository = (await useDataSource()).getRepository(File);
  }

  public async findById(id: string): Promise<File | undefined> {
    const findFile = await this.ormRepository.findOne({
      where: { id },
      relations: [
        'action',
        'from',
        'to',
        'parent',
        'children',
        'parent.parent_file',
        'children.children_file',
        'parent.parent_file.action',
        'children.children_file.action',
        'parent.parent_file.from',
        'children.children_file.from',
        'parent.parent_file.to',
        'children.children_file.to',
      ],
    });
    return findFile || undefined;
  }

  public async findAll(): Promise<File[]> {
    const findFiles = await this.ormRepository.find({
      where: { parent: { parent_id: IsNull() } },
      relations: [
        'action',
        'from',
        'to',
        'parent',
        'children',
        'parent.parent_file',
        'children.children_file',
        'parent.parent_file.action',
        'children.children_file.action',
        'parent.parent_file.from',
        'children.children_file.from',
        'parent.parent_file.to',
        'children.children_file.to',
      ],
      order: {
        created_at: 'DESC',
      },
    });
    return findFiles;
  }
  public async create({
    name,
    description,
    fileName,
    action_id,
    parent_id,
    from_id,
    to_id,
  }: ICreateFileDTO): Promise<File> {
    const file = this.ormRepository.create({
      name,
      description,
      fileName,
      action_id,
      from_id,
      to_id,
    });

    await this.ormRepository.insert(file);

    // const result = await this.ormRepository
    //   .createQueryBuilder()
    //   .insert()
    //   .into(File)
    //   .values({
    //     name,
    //     description,
    //     fileName,
    //     action_id,
    //     parent_id,
    //     from_id,
    //     to_id,
    //   })
    //   .returning('*')
    //   .execute();

    // console.log(result);
    // const file = result.generatedMaps[0] as File;
    // console.log(file);

    return file;
  }

  public async save(file: File): Promise<File> {
    return this.ormRepository.save(file);
  }
}
