import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateActionService } from '@modules/files/services/CreateActionService';
import { FindAllActionsService } from '@modules/files/services/FindAllActionsService';

export class ActionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, finishedName } = req.body;

    const createAction = container.resolve(CreateActionService);
    const action = await createAction.execute({
      name,
      finishedName,
    });

    return res.json(instanceToInstance(action));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const findAllActions = container.resolve(FindAllActionsService);
    const actions = await findAllActions.execute();

    return res.json(instanceToInstance(actions));
  }
}
