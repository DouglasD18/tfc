import { Request } from 'express';

export interface IEmail {
  email: string,
}

export interface IUserRequest extends Request {
  user?: IEmail,
}
export interface ILogin {
  email: string,
  password: string,
}

export interface IHttpReturn {
  code: number,
  token?: string,
  role?: string,
  result?: [object],
}

export interface IVerify {
  data: ILogin,
  iat: number,
}

export interface IUser {
  id: number,
  username: string;
  role: string;
  email: string;
  password: string;
}
