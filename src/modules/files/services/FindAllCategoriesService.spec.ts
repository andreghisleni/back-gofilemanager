import { FakeCategoriesRepository } from '../repositories/fakes/FakeCategoriesRepository';
import { FindAllCategoriesService } from './FindAllCategoriesService';

let fakeCategoriesRepository: FakeCategoriesRepository;

let findAllCategories: FindAllCategoriesService;

describe('FindAllCategories', () => {
  beforeEach(() => {
    fakeCategoriesRepository = new FakeCategoriesRepository();

    findAllCategories = new FindAllCategoriesService(fakeCategoriesRepository);
  });
  it('should be able create a new transaction', async () => {
    await fakeCategoriesRepository.create({
      title: 'Transaction Test',
    });
    await fakeCategoriesRepository.create({
      title: 'Transaction Test',
    });

    const transactions = await findAllCategories.execute();
    expect(transactions).toHaveLength(2);
  });
});
