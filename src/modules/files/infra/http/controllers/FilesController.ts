import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateFileService } from '@modules/files/services/CreateFileService';
import { FindAllFilesService } from '@modules/files/services/FindAllFilesService';
import { FindOneFileService } from '@modules/files/services/FindOneFileService';

export class FilesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, description, action_id, parent_id, to_id } = req.body;
    const createFile = container.resolve(CreateFileService);

    const file = await createFile.execute({
      name,
      description,
      action_id,
      parent_id,
      fileFileName: req.file?.filename || '',
      from_id: req.user.id,
      to_id,
    });
    return res.json(instanceToInstance(file));
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const findAllFiles = container.resolve(FindAllFilesService);
    const files = await findAllFiles.execute();

    return res.json(instanceToInstance(files));
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const findOneFile = container.resolve(FindOneFileService);
    const file = await findOneFile.execute({ id });

    return res.json(instanceToInstance(file));
  }
}
