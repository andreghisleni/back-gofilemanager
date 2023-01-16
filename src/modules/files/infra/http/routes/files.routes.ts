import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { FileFinishedController } from '../controllers/FileFinishedController';
import { FilesController } from '../controllers/FilesController';

const filesRouter = Router();
const upload = multer(uploadConfig.multer);

const filesController = new FilesController();
const fileFinishedController = new FileFinishedController();

filesRouter.use(ensureAuthenticated);

filesRouter.get('/', filesController.index);

filesRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  filesController.show,
);

filesRouter.post(
  '/',
  upload.single('file'),
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      action_id: Joi.string().uuid().required(),
      parent_id: Joi.string().uuid().allow('').required(),
      to_id: Joi.string().uuid().required(),
    },
  }),
  filesController.create,
);

filesRouter.patch(
  '/:id/finished',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  fileFinishedController.update,
);

export { filesRouter };
