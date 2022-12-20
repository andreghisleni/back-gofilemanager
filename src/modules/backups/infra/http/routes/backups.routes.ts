// import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { ExportBackupController } from '../controllers/ExportBackupController';
import { ImportBackupController } from '../controllers/ImportBackupController';

const backupsRouter = Router();
const exportBackupController = new ExportBackupController();
const importBackupController = new ImportBackupController();
const upload = multer(uploadConfig.multer);

backupsRouter.use(ensureAuthenticated);

backupsRouter.post('/export', exportBackupController.create);
backupsRouter.post(
  '/import',
  upload.single('file'),
  importBackupController.create,
);

export { backupsRouter };
