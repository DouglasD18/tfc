import { Router } from 'express';
// import Authorization from '../midllewares/Authorization.midlleware';
import LeaderboardController from '../controllers/Leaderboard.controller';

const LeaderboardRoute = Router();

LeaderboardRoute.get('/home', LeaderboardController.list);

export default LeaderboardRoute;
