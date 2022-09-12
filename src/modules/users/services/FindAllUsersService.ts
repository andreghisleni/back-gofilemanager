import { inject, injectable } from 'tsyringe';

import { User } from '../infra/typeorm/entities/User';
import { IUsersRepository } from '../repositories/IUsersRepository';

@injectable()
export class FindAllUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }// eslint-disable-line

  public async execute(): Promise<User[]> {
    const user = await this.usersRepository.findAll();

    return user;
  }
}
