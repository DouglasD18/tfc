import { Router } from 'express';
import MatchesController from '../controllers/Matches.controller';

const MatchesRoute = Router();

MatchesRoute.get('/', MatchesController.list);

export default MatchesRoute;
