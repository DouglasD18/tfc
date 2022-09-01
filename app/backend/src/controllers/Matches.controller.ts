import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
  static async list(_req: Request, res: Response) {
    const response = await MatchesService.list();
    const { code, matches } = response;

    return res.status(code).json(matches);
  }
}

export default MatchesController;
