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

export interface ITeam {
  id: number,
  teamName: string,
}

export interface IMatch {
  id?: number;
  homeTeam: number;
  homeTeamGoals: number;
  awayTeam: number;
  awayTeamGoals: number;
  inProgress?: boolean;
}

export interface IMatchReturn extends IMatch {
  teamHome: {
    teamName: string,
  },
  teamAway: {
    teamName: string
  }
}

export interface IHttpReturn {
  code: number,
  token?: string,
  role?: string,
  result?: ITeam[],
  team?: ITeam,
  matches?: IMatchReturn[],
  matchReturn?: IMatchReturn,
  match?: IMatch,
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
