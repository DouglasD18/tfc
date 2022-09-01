import { IHttpReturn, ITeam } from '../interfaces';
import Teams from '../database/models/teams';
import throwError from '../utils/throwError';

class TeamsService {
  static async list(): Promise<IHttpReturn> {
    const result = await Teams.findAll() as unknown as [ITeam];
    return { code: 200, result };
  }

  static async getOne(id: number): Promise<IHttpReturn> {
    const team = await Teams.findOne({ where: { id } });

    if (!team) return throwError('notFound', 'Incorrect id');

    return { code: 200, team };
  }
}

export default TeamsService;
