import { container } from 'tsyringe';

import '@modules/users/providers';

import './providers';

import { ActionsRepository } from '@modules/files/infra/typeorm/repositories/ActionsRepository';
import { FileParentsRepository } from '@modules/files/infra/typeorm/repositories/FileParentsRepository';
import { FilesRepository } from '@modules/files/infra/typeorm/repositories/FilesRepository';
import { IActionsRepository } from '@modules/files/repositories/IActionsRepository';
import { IFileParentsRepository } from '@modules/files/repositories/IFileParentsRepository';
import { IFilesRepository } from '@modules/files/repositories/IFilesRepository';
//
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

container.registerSingleton<IFilesRepository>(
  'FilesRepository',
  FilesRepository,
);
container.registerSingleton<IActionsRepository>(
  'ActionsRepository',
  ActionsRepository,
);

container.registerSingleton<IFileParentsRepository>(
  'FileParentsRepository',
  FileParentsRepository,
);
