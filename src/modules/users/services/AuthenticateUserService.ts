import { sign } from 'jsonwebtoken';
import ms from 'ms';
import { injectable, inject } from 'tsyringe';

import auth from '@config/auth';

import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequest {
  user: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  refreshToken: string;
}
@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }// eslint-disable-line

  public async execute({
    user: userName,
    password,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByUser(userName);
    if (!user) {
      throw new AppError('Incorrect user/password combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect user/password combination.', 401);
    }
    const { secret, expiresIn, expiresInRefresh } = auth.jwt;
    const token = sign({ refreshToken: false }, secret, {
      subject: user.id,
      expiresIn,
    });
    const refreshToken = sign(
      {
        refreshToken: true,
        expirete: new Date(Date.now() + ms(expiresInRefresh)).getTime(),
      },
      secret,
      {
        subject: user.id,
        expiresIn: expiresInRefresh,
      },
    );

    return { user, token, refreshToken };
  }
}
