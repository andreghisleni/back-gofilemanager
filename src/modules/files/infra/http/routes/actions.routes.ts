import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { ActionsController } from '../controllers/ActionsController';

const actionsRouter = Router();
const actionsController = new ActionsController();

actionsRouter.use(ensureAuthenticated);

actionsRouter.get('/', actionsController.index);

actionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      finishedName: Joi.string().required(),
    },
  }),
  actionsController.create,
);

export { actionsRouter };
