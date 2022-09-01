import { IHttpReturn } from '../interfaces';
import Teams from '../database/models/teams';

class TeamsService {
  static async list(): Promise<IHttpReturn> {
    const result = await Teams.findAll() as [object];
    return { code: 200, result };
  }
}

export default TeamsService;
