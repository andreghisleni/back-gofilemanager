// import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import path from 'node:path';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import { ExportBackupService } from '@modules/backups/services/ExportBackupService';

export class ExportBackupController {
  public async create(req: Request, res: Response): Promise<void> {
    const exportBackup = container.resolve(ExportBackupService);
    const { tmpFolder } = uploadConfig;

    const backup = await exportBackup.execute();

    res
      .setHeader('file-name', backup.zipFile)
      .download(path.resolve(tmpFolder, backup.zipFile));
  }
}
