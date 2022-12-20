import {
  ICreateCategoryDTO,
  ICreateExactCategoryDTO,
} from '../dtos/ICreateCategoryDTO';
import { Category } from '../infra/typeorm/entities/Category';

export interface ICategoriesRepository {
  findById(id: string): Promise<Category | undefined>;
  findByTitle(title: string): Promise<Category | undefined>;
  findAll(): Promise<Category[]>;
  create(data: ICreateCategoryDTO): Promise<Category>;
  createExact(data: ICreateExactCategoryDTO): Promise<Category>;
  save(transaction: Category): Promise<Category>;
}
