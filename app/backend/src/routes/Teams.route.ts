import { Router } from 'express';
import TeamsController from '../controllers/Teams.controller';

const TeamsRoute = Router();

TeamsRoute.get('/', TeamsController.list);

export default TeamsRoute;
