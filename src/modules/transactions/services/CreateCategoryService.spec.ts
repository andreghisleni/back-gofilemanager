import { AppError } from '@shared/errors/AppError';

import { FakeCategoriesRepository } from '../repositories/fakes/FakeCategoriesRepository';
import { CreateCategoryService } from './CreateCategoryService';

let fakeCategoriesRepository: FakeCategoriesRepository;

let createCategory: CreateCategoryService;
describe('CreateCategory', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createCategory = new CreateCategoryService(fakeCategoriesRepository);
  });
  it('should be able create a new category', async () => {
    const category = await createCategory.execute({
      title: 'Category Test',
    });
    expect(category).toHaveProperty('id');
  });
  it('should not be able to create a new category with same title from another', async () => {
    await createCategory.execute({
      title: 'Category Test',
    });
    await expect(
      createCategory.execute({
        title: 'Category Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
