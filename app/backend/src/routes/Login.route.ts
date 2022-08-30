import { Router } from 'express';
import Authorization from '../midllewares/Authorization.midlleware';
import LoginController from '../controllers/Login.controller';

const LoginRoute = Router();

LoginRoute.get('/validate', Authorization, LoginController.getRole);
LoginRoute.post('/', LoginController.login);

export default LoginRoute;
