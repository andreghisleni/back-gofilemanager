import { container } from 'tsyringe';

import '@modules/users/providers';

import './providers';

import { CategoriesRepository } from '@modules/transactions/infra/typeorm/repositories/CategoriesRepository';
import { TransactionsRepository } from '@modules/transactions/infra/typeorm/repositories/TransactionsRepository';
import { ICategoriesRepository } from '@modules/transactions/repositories/ICategoriesRepository';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { UserTokensRepository } from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/users/repositories/IUserTokensRepository';

import './providers/BackendJobs';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ITransactionsRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);
container.registerSingleton<ICategoriesRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);
