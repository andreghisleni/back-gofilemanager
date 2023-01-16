import { ICreateActionDTO } from '../dtos/ICreateActionDTO';
import { Action } from '../infra/typeorm/entities/Action';

export interface IActionsRepository {
  connect(): Promise<void>;
  findById(id: string): Promise<Action | undefined>;
  findByName(name: string): Promise<Action | undefined>;
  findAll(): Promise<Action[]>;
  create(data: ICreateActionDTO): Promise<Action>;
  save(transaction: Action): Promise<Action>;
}
