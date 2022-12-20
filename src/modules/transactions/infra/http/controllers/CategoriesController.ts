import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCategoryService } from '@modules/transactions/services/CreateCategoryService';
import { FindAllCategoriesService } from '@modules/transactions/services/FindAllCategoriesService';

export class CategoriesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { title } = req.body;
    const createCategory = container.resolve(CreateCategoryService);
    const transaction = await createCategory.execute({
      title,
    });
    return res.json(instanceToInstance(transaction));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const findAllCategories = container.resolve(FindAllCategoriesService);
    const transactions = await findAllCategories.execute();

    return res.json(instanceToInstance(transactions));
  }
}
