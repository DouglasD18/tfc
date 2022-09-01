import { Router } from 'express';
import TeamsController from '../controllers/Teams.controller';

const TeamsRoute = Router();

TeamsRoute.get('/', TeamsController.list);
TeamsRoute.get('/:id', TeamsController.getOne);

export default TeamsRoute;
