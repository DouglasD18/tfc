import { Router } from 'express';
import LoginController from '../controllers/Login.controller';

const LoginRoute = Router();

LoginRoute.post('/', LoginController.login);

export default LoginRoute;
