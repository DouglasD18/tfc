import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IEmail, IUserRequest } from '../interfaces/index';

const secret = process.env.JWT_SECRET || 'jwt_secret';

const Authorization = (req: IUserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'Token not found' });

  try {
    const decoded = verify(token, secret);

    const { email } = decoded as IEmail;
    req.user = { email };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default Authorization;
