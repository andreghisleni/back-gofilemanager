import path from 'node:path';
import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { IMailProvider } from '../../../shared/container/providers/MailProvider/models/IMailProvider';
import { File } from '../infra/typeorm/entities/File';
import { IActionsRepository } from '../repositories/IActionsRepository';
import { IFileParentsRepository } from '../repositories/IFileParentsRepository';
import { IFilesRepository } from '../repositories/IFilesRepository';

interface IRequest {
  name: string;
  description: string;
  fileFileName: string;
  action_id: string;
  parent_id: string;
  from_id: string;
  to_id: string;
}
@injectable()
export class CreateFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('ActionsRepository')
    private actionsRepository: IActionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('FileParentsRepository')
    private fileParentsRepository: IFileParentsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) { } // eslint-disable-line

  public async execute({
    name,
    description,
    fileFileName,
    action_id,
    parent_id,
    from_id,
    to_id,
  }: IRequest): Promise<File> {
    await this.filesRepository.connect();
    await this.actionsRepository.connect();
    await this.usersRepository.connect();
    await this.fileParentsRepository.connect();

    const checkActionExists = await this.actionsRepository.findById(action_id);

    if (!checkActionExists) {
      throw new AppError('Action does not exists');
    }

    const checkFromUserExists = await this.usersRepository.findById(from_id);

    if (!checkFromUserExists) {
      throw new AppError('From user does not exists');
    }

    const checkToUserExists = await this.usersRepository.findById(to_id);

    if (!checkToUserExists) {
      throw new AppError('To user does not exists');
    }

    let parent: File | undefined;
    if (parent_id) {
      const checkParentFileExists = await this.filesRepository.findById(
        parent_id,
      );

      if (!checkParentFileExists) {
        throw new AppError('Parent file does not exists');
      }

      parent = checkParentFileExists;

      parent.finished = true;
    }

    const fileName = await this.storageProvider.saveFile(fileFileName);

    const file = await this.filesRepository.create({
      name,
      description,
      fileName,
      action_id,
      parent_id: null,
      from_id,
      to_id,
    });

    if (parent) {
      await this.fileParentsRepository.create({
        children_id: file.id,
        parent_id: parent.id,
      });

      await this.filesRepository.save(parent);
    }

    const newFileAlertTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'new_file_alert.hbs',
    );
    await this.mailProvider.sendMail({
      to: {
        name: checkToUserExists.name,
        email: checkToUserExists.email,
      },
      subject: `[${process.env.APP_NAME}] Novo arquivo cadastrado`,
      templateData: {
        file: newFileAlertTemplate,
        variables: {
          user_name: checkToUserExists.name,
          name: file.name,
          description: file.description,
          from_name: checkFromUserExists.name,
          action_name: checkActionExists.name,
          link: `${process.env.APP_WEB_URL}/file/${file.id}`,
        },
      },
    });

    return file;
  }
}
