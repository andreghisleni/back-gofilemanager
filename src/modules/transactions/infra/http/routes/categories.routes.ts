import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { CategoriesController } from '../controllers/CategoriesController';

const categoriesRouter = Router();
const categoriesController = new CategoriesController();

categoriesRouter.use(ensureAuthenticated);

categoriesRouter.get('/', categoriesController.index);

categoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
    },
  }),
  categoriesController.create,
);

export { categoriesRouter };
