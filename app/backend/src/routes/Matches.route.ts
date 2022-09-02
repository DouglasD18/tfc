import { Router } from 'express';
import Authorization from '../midllewares/Authorization.midlleware';
import MatchesController from '../controllers/Matches.controller';

const MatchesRoute = Router();

MatchesRoute.get('/', MatchesController.list);
MatchesRoute.patch('/:id/finish', Authorization, MatchesController.updateMatchFinish);
MatchesRoute.patch('/:id', Authorization, MatchesController.updateMatch);
MatchesRoute.post('/', Authorization, MatchesController.createMatch);

export default MatchesRoute;
