import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { UsersController } from '../controllers/UsersController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  ensureAuthenticated,
  usersController.create,
);
usersRoutes.get('/', ensureAuthenticated, usersController.index);

export { usersRoutes };
