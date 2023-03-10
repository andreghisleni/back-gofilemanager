import { Router } from 'express';

import { actionsRouter } from '@modules/files/infra/http/routes/actions.routes';
import { filesRouter } from '@modules/files/infra/http/routes/files.routes';
import { passwordRouter } from '@modules/users/infra/http/routes/password.routes';
import { profileRouter } from '@modules/users/infra/http/routes/profile.routes';
import { sessionsRouter } from '@modules/users/infra/http/routes/sessions.routes';
import { usersRoutes } from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

routes.use('/files', filesRouter);
routes.use('/actions', actionsRouter);

export { routes };
