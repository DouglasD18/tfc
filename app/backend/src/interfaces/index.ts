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

export interface ITeamClassification {
  classification: number,
  team: string,
  points: number,
  matches: number,
  wins: number,
  draws: number,
  losses: number,
  goalsScored: number,
  goalsConceded: number,
  goalDifference: number,
  percent: number,
}

export interface IHttpReturn {
  code: number,
  token?: string,
  message?: string,
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
