import { Request, Response } from 'express';
import TeamsService from '../services/Teams.service';

class TeamsController {
  static async list(_req: Request, res: Response) {
    const response = await TeamsService.list();
    const { code, result } = response;

    return res.status(code).json(result);
  }
}

export default TeamsController;
