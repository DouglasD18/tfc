import Teams from '../database/models/teams';
import Matches from '../database/models/matches';
import { IHttpReturn, IMatch, IMatchReturn } from '../interfaces';
import throwError from '../utils/throwError';

class MatchesService {
  static async getById(id: number): Promise<string> {
    const team = await Teams.findOne({ where: { id } });

    if (!team) return throwError('notFound', 'There is no team with such id!');

    const { teamName } = team;
    return teamName;
  }

  static async formatResponse(matches: IMatch[]): Promise<IMatchReturn[]> {
    const result = Promise.all(matches.map(async (match): Promise<IMatchReturn> => {
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
    return result as unknown as IMatchReturn[];
  }

  static async listWithFilter(inProgress: string): Promise<IHttpReturn> {
    let bool;
    if (inProgress === 'true') {
      bool = true;
    } else {
      bool = false;
    }
    const response = await Matches.findAll({ where: { inProgress: bool } });
    const matches = await this.formatResponse(response);
    return { code: 200, matches };
  }

  static async list(): Promise<IHttpReturn> {
    const response = await Matches.findAll();
    const matches = await this.formatResponse(response);

    return { code: 200, matches };
  }

  static async createMatch(values: IMatch): Promise<IHttpReturn | void> {
    const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals } = values;
    const message = 'It is not possible to create a match with two equal teams';
    if (homeTeam === awayTeam) return throwError('unauthorized', message);
    const home = await this.getById(homeTeam);
    const away = await this.getById(awayTeam);
    if (home && away) {
      const request = { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress: true };
      const match = await Matches.create(request);
      return { code: 201, match };
    }
  }

  static async updateMatches(id: number): Promise<IHttpReturn> {
    await Matches.update({ inProgress: false }, { where: { id } });

    return { code: 200, message: 'Finished' };
  }
}

export default MatchesService;
