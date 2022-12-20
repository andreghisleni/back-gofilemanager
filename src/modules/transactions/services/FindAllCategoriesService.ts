import { inject, injectable } from 'tsyringe';

import { Category } from '../infra/typeorm/entities/Category';
import { ICategoriesRepository } from '../repositories/ICategoriesRepository';

// interface IRequest {}

@injectable()
export class FindAllCategoriesService {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {} // eslint-disable-line
  public async execute(/* {}: IRequest */): Promise<Category[]> {
    const categories = await this.categoriesRepository.findAll();

    return categories;
  }
}
