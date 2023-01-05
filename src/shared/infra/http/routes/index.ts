import { Router } from 'express';

import { accountsRouter } from '@modules/accounts/infra/http/routes/accounts.routes';
import { backupsRouter } from '@modules/backups/infra/http/routes/backups.routes';
import { categoriesRouter } from '@modules/transactions/infra/http/routes/categories.routes';
import { transactionsRouter } from '@modules/transactions/infra/http/routes/transactions.routes';
import { passwordRouter } from '@modules/users/infra/http/routes/password.routes';
import { profileRouter } from '@modules/users/infra/http/routes/profile.routes';
import { sessionsRouter } from '@modules/users/infra/http/routes/sessions.routes';
import { usersRoutes } from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/transactions', transactionsRouter);
routes.use('/categories', categoriesRouter);
routes.use('/accounts', accountsRouter);

routes.use('/backups', backupsRouter);

export { routes };
