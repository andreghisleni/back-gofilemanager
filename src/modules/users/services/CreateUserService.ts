import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  email: string;
  user: string;
  password: string;
}
@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { } // eslint-disable-line

  public async execute({
    name,
    email,
    user: userName,
    password,
  }: IRequest): Promise<User> {
    await this.usersRepository.connect();

    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.usersRepository.create({
      name,
      email,
      user: userName,
      password: hashedPassword,
      first_password: false,
    });

    return user;
  }
}
