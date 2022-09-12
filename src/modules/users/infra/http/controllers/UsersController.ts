import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserByAnotherUserService } from '@modules/users/services/CreateUserByAnotherUserService';
import { FindAllUsersService } from '@modules/users/services/FindAllUsersService';

export class UsersController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email } = req.body;

    const createUser = container.resolve(CreateUserByAnotherUserService);
    const user = await createUser.execute({
      name,
      email,
    });

    return res.json(classToClass(user));
  }

  async index(req: Request, res: Response): Promise<Response> {
    const findAllUsers = container.resolve(FindAllUsersService);
    const users = await findAllUsers.execute();
    return res.json(classToClass(users));
  }
}
