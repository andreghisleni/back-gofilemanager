import { Repository } from 'typeorm';
import { useDataSource } from 'typeorm-extension';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { User } from '../entities/User';

export class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  public async connect(): Promise<void> {
    this.ormRepository = (await useDataSource()).getRepository(User);
  }
  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: { id },
    });
    return findUser || undefined;
  }

  public async findAll(): Promise<User[]> {
    const findUsers = await this.ormRepository.find();
    return findUsers;
  }

  public async findByUser(user: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: [{ user }],
    });
    return findUser || undefined;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({
      where: [{ email }],
    });
    return findUser || undefined;
  }

  public async create({
    name,
    email,
    user: userName,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      email,
      user: userName,

      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}
