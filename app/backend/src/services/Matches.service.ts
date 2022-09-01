import Teams from '../database/models/teams';
import Matches from '../database/models/matches';
import { IHttpReturn, IMatch, IMatchReturn } from '../interfaces';
import throwError from '../utils/throwError';

class MatchesService {
  static async getById(id: number): Promise<string> {
    const team = await Teams.findOne({ where: { id } });

    if (!team) return throwError('notFound', 'Incorrect id');

    const { teamName } = team;
    return teamName;
  }

  static async getAll(): Promise<IMatchReturn[]> {
    const result = await Matches.findAll();
    const matches = Promise.all(result.map(async (match): Promise<IMatchReturn> => {
      const { id, homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress } = match;
      const teamHome = await this.getById(homeTeam);
      const teamAway = await this.getById(awayTeam);
      const newReturn = {
        id,
        homeTeam,
        homeTeamGoals,
        awayTeam,
        awayTeamGoals,
        inProgress,
        teamHome: { teamName: teamHome },
        teamAway: { teamName: teamAway },
      };

      return newReturn as IMatchReturn;
    }));
    return matches as unknown as IMatchReturn[];
  }

  static async list(): Promise<IHttpReturn> {
    const matches = await this.getAll();

    return { code: 200, matches };
  }

  static async createMatch(values: IMatch): Promise<IHttpReturn | void> {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = values;
    if (homeTeam === awayTeam) return throwError('notAcceptable', 'Not accept the same team');
    const home = await this.getById(homeTeam);
    const away = await this.getById(awayTeam);
    if (home && away) {
      const request = { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress: true };
      const match = await Matches.create(request);
      return { code: 201, match };
    }
  }
}

export default MatchesService;
