import { Repository, getRepository } from 'typeorm';

import { ICreateCategoryDTO } from '@modules/transactions/dtos/ICreateCategoryDTO';
import { ICategoriesRepository } from '@modules/transactions/repositories/ICategoriesRepository';

import { ICreateExactCategoryDTO } from '../../../dtos/ICreateCategoryDTO';
import { Category } from '../entities/Category';

export class CategoriesRepository implements ICategoriesRepository {
  private ormRepository: Repository<Category>;

  constructor() {
    this.ormRepository = getRepository(Category);
  }

  public async findById(id: string): Promise<Category | undefined> {
    const findCategory = await this.ormRepository.findOne({
      where: { id },
    });
    return findCategory;
  }

  public async findByTitle(title: string): Promise<Category | undefined> {
    const findCategory = await this.ormRepository.findOne({
      where: { title },
    });
    return findCategory;
  }

  public async findAll(): Promise<Category[]> {
    const findCategories = await this.ormRepository.find();
    return findCategories;
  }
  public async create({ title }: ICreateCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({
      title,
    });

    await this.ormRepository.save(category);

    return category;
  }
  public async createExact({
    id,
    title,
    created_at,
    updated_at,
  }: ICreateExactCategoryDTO): Promise<Category> {
    const category = this.ormRepository.create({
      id,
      title,
      created_at,
      updated_at,
    });

    await this.ormRepository.save(category);

    return category;
  }

  public async save(category: Category): Promise<Category> {
    return this.ormRepository.save(category);
  }
}
