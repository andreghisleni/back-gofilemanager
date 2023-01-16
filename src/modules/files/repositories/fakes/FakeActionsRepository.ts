import { v4 as uuid } from 'uuid';

import { ICreateActionDTO } from '@modules/files/dtos/ICreateActionDTO';
import { Action } from '@modules/files/infra/typeorm/entities/Action';

import { IActionsRepository } from '../IActionsRepository';

export class FakeActionsRepository implements IActionsRepository {
  private actions: Action[] = [];

  public async connect(): Promise<void> { }// eslint-disable-line

  public async findById(id: string): Promise<Action | undefined> {
    const findAction = this.actions.find(action => action.id === id);
    return findAction;
  }

  public async findByName(name: string): Promise<Action | undefined> {
    const findAction = this.actions.find(action => action.name === name);
    return findAction;
  }

  public async findAll(): Promise<Action[]> {
    const findActions = this.actions;
    return findActions;
  }

  public async create(actionData: ICreateActionDTO): Promise<Action> {
    const action = new Action();
    Object.assign(
      action,
      {
        id: uuid(),
      },
      actionData,
    );

    this.actions.push(action);

    return action;
  }

  public async save(action: Action): Promise<Action> {
    const findIndex = this.actions.findIndex(
      findAction => findAction.id === action.id,
    );

    this.actions[findIndex] = action;
    return action;
  }
}
