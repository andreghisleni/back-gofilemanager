import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImportBackupService } from '@modules/backups/services/ImportBackupService';

export class ImportBackupController {
  public async create(req: Request, res: Response): Promise<void> {
    const importBackup = container.resolve(ImportBackupService);

    const result = await importBackup.execute({
      fileName: req.file?.filename || ``,
    });

    res.json(result);
  }
}
