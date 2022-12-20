import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { TransactionAddBillsController } from '../controllers/TransactionAddBillsController';
import { TransactionsController } from '../controllers/TransactionsController';

const transactionsRouter = Router();
const upload = multer(uploadConfig.multer);

const transactionsController = new TransactionsController();
const transactionAddBillsController = new TransactionAddBillsController();

transactionsRouter.use(ensureAuthenticated);

transactionsRouter.get('/', transactionsController.index);
transactionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      value: Joi.number().required(),
      type: Joi.string().valid('income', 'outcome', 'initvalue').required(),
      category_id: Joi.string().uuid().required(),
      description: Joi.string().required(),
    },
  }),
  transactionsController.create,
);

transactionsRouter.post(
  '/:transaction_id/bills',
  celebrate({
    [Segments.PARAMS]: {
      transaction_id: Joi.string().uuid().required(),
    },
  }),
  upload.array('billFilesPath'),
  transactionAddBillsController.create,
);

export { transactionsRouter };
