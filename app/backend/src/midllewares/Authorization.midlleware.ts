import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IVerify, IUserRequest } from '../interfaces/index';
import throwError from '../utils/throwError';

const secret = process.env.JWT_SECRET || 'jwt_secret';

const Authorization = (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) return throwError('unauthorized', 'Token not found!');

  try {
    const decoded = verify(token, secret);

    const { data } = decoded as IVerify;
    const { email } = data;
    req.user = { email };

    return next();
  } catch (err) {
    return throwError('unauthorized', 'Token must be a valid token');
  }
};

export default Authorization;
