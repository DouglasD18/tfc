import { Router } from 'express';
// import Authorization from '../midllewares/Authorization.midlleware';
import LeaderboardController from '../controllers/Leaderboard.controller';

const LeaderboardRoute = Router();

LeaderboardRoute.get('/', LeaderboardController.list);
LeaderboardRoute.get('/home', LeaderboardController.listHome);
LeaderboardRoute.get('/away', LeaderboardController.listAway);

export default LeaderboardRoute;
