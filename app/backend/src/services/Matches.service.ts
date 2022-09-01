import Teams from '../database/models/teams';
import Matches from '../database/models/matches';
import { IHttpReturn, IMatch } from '../interfaces';
import throwError from '../utils/throwError';

class MatchesService {
  static async getById(id: number): Promise<string> {
    const team = await Teams.findOne({ where: { id } });

    if (!team) return throwError('notFound', 'Incorrect id');

    const { teamName } = team;
    return teamName;
  }

  static async getAll(): Promise<IMatch[]> {
    const result = await Matches.findAll();
    const matches = Promise.all(result.map(async (match): Promise<IMatch> => {
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

      return newReturn as IMatch;
    }));
    return matches as unknown as IMatch[];
  }

  static async list(): Promise<IHttpReturn> {
    const matches = await this.getAll();

    return { code: 200, matches };
  }
}

export default MatchesService;
