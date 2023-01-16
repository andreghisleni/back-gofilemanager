import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateStatusToFinishedFileService } from '../../../services/UpdateStatusToFinishedFileService';

export class FileFinishedController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const updateStatusToFinishedFile = container.resolve(
      UpdateStatusToFinishedFileService,
    );
    const file = await updateStatusToFinishedFile.execute({ id });

    return res.json(instanceToInstance(file));
  }
}
