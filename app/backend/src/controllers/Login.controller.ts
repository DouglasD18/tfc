import { Request, Response } from 'express';
import { IEmail, IUserRequest } from '../interfaces/index';
import LoginService from '../services/Login.service';

class LoginController {
  static async login(req: Request, res: Response) {
    const { body } = req;
    const result = await LoginService.login(body);

    const { code, token } = result;
    return res.status(code).json({ token });
  }

  static async getRole(req: IUserRequest, res: Response) {
    const { email } = req.user as IEmail;
    const result = await LoginService.getRole(email);

    if (result) {
      const { code, role } = result;
      return res.status(code).json({ role });
    }
  }
}

export default LoginController;
