import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransactionService } from '@modules/transactions/services/CreateTransactionService';
import { FindAllTransactionsService } from '@modules/transactions/services/FindAllTransactionsService';

export class TransactionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { title, value, type, category_id, description, accounts } = req.body;
    const createTransaction = container.resolve(CreateTransactionService);
    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category_id,
      description,
      accounts,
    });
    return res.json(instanceToInstance(transaction));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const findAllTransactions = container.resolve(FindAllTransactionsService);
    const transactions = await findAllTransactions.execute();

    return res.json(instanceToInstance(transactions));
  }
}
