import 'dotenv';
import Joi = require('joi');
import jwt = require('jsonwebtoken');
import bcrypt = require('bcryptjs');
import throwError from '../utils/throwError';
import Users from '../database/models/user';
import { ILogin, IHttpReturn } from '../interfaces/index';

const secret = process.env.JWT_SECRET || 'jwt_secret';

class LoginService {
  static valuesValidate(user: ILogin): void {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(user);

    if (error) return throwError('badRequest', 'All fields must be filled');
  }

  static async userValidate(user: ILogin): Promise<void> {
    const { email, password } = user;
    const emailValidation = await Users.findOne({ where: { email } });
    if (emailValidation === null) throwError('unauthorized', 'Incorrect email or password');
    else {
      const passwordValidation = bcrypt.compareSync(password, emailValidation.password);
      if (passwordValidation === null) throwError('unauthorized', 'Incorrect email or password');
    }
  }

  static async login(user: ILogin): Promise<IHttpReturn> {
    this.valuesValidate(user);
    await this.userValidate(user);
    const token = jwt.sign({ data: user }, secret);
    return { code: 200, token };
  }

  static async getRole(email: string): Promise<IHttpReturn> {
    const user = await Users.findOne({ where: { email } });

    const { role } = user as Users;

    return { code: 200, role };
  }
}

export default LoginService;
