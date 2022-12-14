import { NextFunction, Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
  static async list(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress !== undefined) {
      const response = await MatchesService.listWithFilter(inProgress.toString());
      const { code, matches } = response;

      return res.status(code).json(matches);
    }
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

  static async updateMatchFinish(req: Request, res: Response) {
    const id = Number(req.params.id);
    const response = await MatchesService.updateMatchFinish(id);

    const { code, message } = response;
    return res.status(code).json({ message });
  }

  static async updateMatch(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    const { homeTeamGoals, awayTeamGoals } = req.body;
    try {
      const response = await MatchesService.updateMatch(id, homeTeamGoals, awayTeamGoals);

      const { code } = response;
      return res.status(code).json({ message: 'Match updated' });
    } catch (error) {
      next(error);
    }
  }
}

export default MatchesController;
