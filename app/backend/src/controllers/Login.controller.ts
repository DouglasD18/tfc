import { Request, Response } from 'express';
import LoginService from '../services/Login.service';

class LoginController {
  static async login(req: Request, res: Response) {
    const user = req.body;
    const result = await LoginService.login(user);

    const { code, token } = result;
    return res.status(code).json({ token });
  }
}

export default LoginController;
