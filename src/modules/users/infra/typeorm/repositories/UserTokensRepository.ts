import { Repository } from 'typeorm';
import { useDataSource } from 'typeorm-extension';

import { IUserTokensRepository } from '@modules/users/repositories/IUserTokensRepository';

import { User } from '../entities/User';
import { UserToken } from '../entities/UserToken';

export class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  public async connect(): Promise<void> {
    this.ormRepository = (await useDataSource()).getRepository(UserToken);
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        token,
      },
      relations: ['user'],
    });
    return userToken || undefined;
  }

  public async findByUserId(id: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });
    return userToken || undefined;
  }

  public async generate(user: User): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
