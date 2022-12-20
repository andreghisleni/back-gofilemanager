import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

interface IRequest {
  title: string;
}
@injectable()
export class CreateCategoryService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) { } // eslint-disable-line

  public async execute({ title }: IRequest): Promise<Category> {
    const checkCategoryExists = await this.categoriesRepository.findByTitle(
      title,
    );

    if (checkCategoryExists) {
      throw new AppError('Category already exists');
    }
    const category = await this.categoriesRepository.create({
      title,
    });
    return category;
  }
}
