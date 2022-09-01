import { Router } from 'express';
import Authorization from '../midllewares/Authorization.midlleware';
import MatchesController from '../controllers/Matches.controller';

const MatchesRoute = Router();

MatchesRoute.get('/', MatchesController.list);
MatchesRoute.post('/', Authorization, MatchesController.createMatch);

export default MatchesRoute;
