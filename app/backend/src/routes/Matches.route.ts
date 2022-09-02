import { Router } from 'express';
import Authorization from '../midllewares/Authorization.midlleware';
import MatchesController from '../controllers/Matches.controller';

const MatchesRoute = Router();

MatchesRoute.get('/', MatchesController.list);
MatchesRoute.post('/', Authorization, MatchesController.createMatch);
MatchesRoute.patch('/:id', Authorization, MatchesController.updateMatch);
MatchesRoute.patch('/:id/finish', Authorization, MatchesController.updateMatchFinish);

export default MatchesRoute;
