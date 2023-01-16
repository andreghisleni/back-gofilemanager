import { inject, injectable } from 'tsyringe';

import { Action } from '../infra/typeorm/entities/Action';
import { IActionsRepository } from '../repositories/IActionsRepository';

// interface IRequest {}

@injectable()
export class FindAllActionsService {
  constructor(
    @inject('ActionsRepository')
    private actionsRepository: IActionsRepository,
  ) { } // eslint-disable-line
  public async execute(/* {}: IRequest */): Promise<Action[]> {
    await this.actionsRepository.connect();

    const actions = await this.actionsRepository.findAll();

    return actions;
  }
}
