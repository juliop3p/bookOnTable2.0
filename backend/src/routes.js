import { Router } from 'express';

import auth from './app/middlewares/auth';

import AdminControler from './app/controllers/AdminController';
import SessionController from './app/controllers/SessionController';
import SuperAdminController from './app/controllers/SuperAdminController';
import CategoryController from './app/controllers/CategoryController';
import PostController from './app/controllers/PostController';

const routes = new Router();

routes.get('/', (req, res) => {
  res.send('API BOOK ON TABLE');
});

routes.post('/sessions', SessionController.store);

routes.get('/categories', CategoryController.index);
routes.get('/categories/:id', CategoryController.show);

routes.get('/posts', PostController.index);
routes.get('/posts/:id', PostController.show);

routes.use(auth);

routes.get('/admins', AdminControler.index);
routes.post('/admins', AdminControler.store);
routes.put('/admins', AdminControler.update);
routes.delete('/admins', AdminControler.destroy);

routes.put('/admins/:id', SuperAdminController.update);
routes.delete('/admins/:id', SuperAdminController.destroy);

routes.post('/categories', CategoryController.store);
routes.put('/categories/:id', CategoryController.update);
routes.delete('/categories/:id', CategoryController.destroy);

routes.post('/posts', PostController.store);
routes.put('/posts/:id', PostController.update);
routes.delete('/posts/:id', PostController.destroy);

export default routes;
