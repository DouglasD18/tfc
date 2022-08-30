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

    if (error) return throwError('badRequest', 'Invalid Body!');
  }

  static async userValidate(user: ILogin): Promise<void> {
    const { email, password } = user;
    const emailValidation = await Users.findOne({ where: { email } });
    if (emailValidation === null) throwError('unauthorized', 'Invalid User!');
    else {
      const passwordValidation = bcrypt.compareSync(password, emailValidation.password);
      if (passwordValidation === null) throwError('unauthorized', 'Invalid User!');
    }
  }

  static async login(user: ILogin): Promise<IHttpReturn> {
    this.valuesValidate(user);
    await this.userValidate(user);
    const token = jwt.sign({ data: user }, secret);
    return { code: 200, token };
  }
}

export default LoginService;
