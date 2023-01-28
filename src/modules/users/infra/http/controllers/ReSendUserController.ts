import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ReSandEmailToNewUserService } from '@modules/users/services/ReSandEmailToNewUserService';

export class ReSendUserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;

    const createUser = container.resolve(ReSandEmailToNewUserService);
    const user = await createUser.execute({
      user_id,
    });

    return res.json(instanceToInstance(user));
  }
}
