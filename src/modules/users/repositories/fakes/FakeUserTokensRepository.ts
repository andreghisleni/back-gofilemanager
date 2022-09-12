import { v4 as uuid } from 'uuid';

import { User } from '../../infra/typeorm/entities/User';
import { UserToken } from '../../infra/typeorm/entities/UserToken';
import { IUserTokensRepository } from '../IUserTokensRepository';

export class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user: User): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(ut => ut.token === token);

    return userToken;
  }

  public async findByUserId(id: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(ut => ut.user.id === id);

    return userToken;
  }

  public async delete(id: string): Promise<void> {
    const userToken = this.userTokens.find(ut => ut.id === id);

    if (!userToken) return;

    this.userTokens.splice(this.userTokens.indexOf(userToken), 1);
  }
}
