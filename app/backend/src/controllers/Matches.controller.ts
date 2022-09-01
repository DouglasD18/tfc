import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
  static async list(_req: Request, res: Response) {
    // const { inProgress } = req.query;
    const response = await MatchesService.list();
    const { code, matches } = response;

    return res.status(code).json(matches);
  }

  static async createMatch(req: Request, res: Response, next: NextFunction) {
    const request = req.body;
    try {
      const response = await MatchesService.createMatch(request);
      if (response) {
        const { code, match } = response;
        return res.status(code).json(match);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default MatchesController;
