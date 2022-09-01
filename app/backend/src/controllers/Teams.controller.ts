import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/Teams.service';

class TeamsController {
  static async list(_req: Request, res: Response) {
    const response = await TeamsService.list();
    const { code, result } = response;

    return res.status(code).json(result);
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);
    try {
      const response = await TeamsService.getOne(id);
      const { code, team } = response;

      return res.status(code).json(team);
    } catch (error) {
      next(error);
    }
  }
}

export default TeamsController;
