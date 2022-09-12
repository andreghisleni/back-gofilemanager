import { User } from '../infra/typeorm/entities/User';
import { UserToken } from '../infra/typeorm/entities/UserToken';

export interface IUserTokensRepository {
  generate(user: User): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  delete(id: string): Promise<void>;
  findByUserId(id: string): Promise<UserToken | undefined>;
}
