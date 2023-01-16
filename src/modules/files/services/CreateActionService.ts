import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { Action } from '../infra/typeorm/entities/Action';
import { IActionsRepository } from '../repositories/IActionsRepository';

interface IRequest {
  name: string;
  finishedName: string;
}
@injectable()
export class CreateActionService {
  constructor(
    @inject('ActionsRepository')
    private actionsRepository: IActionsRepository,
  ) { } // eslint-disable-line

  public async execute({ name, finishedName }: IRequest): Promise<Action> {
    await this.actionsRepository.connect();

    const checkActionExists = await this.actionsRepository.findByName(name);

    if (checkActionExists) {
      throw new AppError('Action already exists');
    }
    const action = await this.actionsRepository.create({
      name,
      finishedName,
    });
    return action;
  }
}
