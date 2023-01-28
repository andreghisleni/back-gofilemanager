import crypto from 'crypto';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

import { User } from '../infra/typeorm/entities/User';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';
import { IUsersRepository } from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}
@injectable()
export class ReSandEmailToNewUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { } // eslint-disable-line

  public async execute({ user_id }: IRequest): Promise<User> {
    await this.usersRepository.connect();

    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('User does not exists.');
    }
    const password = crypto.randomBytes(6).toString('hex');

    const hashedPassword = await this.hashProvider.generateHash(password);

    checkUserExists.password = hashedPassword;

    await this.usersRepository.save(checkUserExists);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'new_user.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name: checkUserExists.name,
        email: checkUserExists.email,
      },
      subject: `[${process.env.APP_NAME}] Novo usuario cadastrado`,
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: checkUserExists.name,
          url: `${process.env.APP_WEB_URL}`,
          user: checkUserExists.user,
          password,
        },
      },
    });

    return checkUserExists;
  }
}
