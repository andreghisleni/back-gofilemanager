import { Repository } from 'typeorm';
import { useDataSource } from 'typeorm-extension';

import { ICreateActionDTO } from '@modules/files/dtos/ICreateActionDTO';
import { IActionsRepository } from '@modules/files/repositories/IActionsRepository';

import { Action } from '../entities/Action';

export class ActionsRepository implements IActionsRepository {
  private ormRepository: Repository<Action>;

  public async connect(): Promise<void> {
    this.ormRepository = (await useDataSource()).getRepository(Action);
  }

  public async findById(id: string): Promise<Action | undefined> {
    const findAction = await this.ormRepository.findOne({
      where: { id },
    });
    return findAction || undefined;
  }

  public async findByName(name: string): Promise<Action | undefined> {
    const findAction = await this.ormRepository.findOne({
      where: { name },
    });
    return findAction || undefined;
  }

  public async findAll(): Promise<Action[]> {
    const findActions = await this.ormRepository.find();
    return findActions;
  }
  public async create({
    name,
    finishedName,
  }: ICreateActionDTO): Promise<Action> {
    const action = this.ormRepository.create({
      name,
      finishedName,
    });

    await this.ormRepository.save(action);

    return action;
  }

  public async save(action: Action): Promise<Action> {
    return this.ormRepository.save(action);
  }
}
