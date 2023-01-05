import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateAccountService } from '@modules/accounts/services/CreateAccountService';
import { FindAllAccountsService } from '@modules/accounts/services/FindAllAccountsService';

export class AccountsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body;
    const createAccount = container.resolve(CreateAccountService);
    const transaction = await createAccount.execute({
      name,
      description,
    });
    return res.json(instanceToInstance(transaction));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const findAllAccounts = container.resolve(FindAllAccountsService);
    const transactions = await findAllAccounts.execute();

    return res.json(instanceToInstance(transactions));
  }
}
