import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

class LeaderboardController {
  static async list(_req: Request, res: Response) {
    const classification = await LeaderboardService.classification(true);

    return res.status(200).json(classification);
  }
}

export default LeaderboardController;
