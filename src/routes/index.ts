import { Router } from 'express';


import {add as voteAdd} from '../controller/vote/add'

// User-route
const voteRouter = Router();
voteRouter.post('/vote', voteAdd);



// Export the base-router
const baseRouter = Router();
baseRouter.use('/', voteRouter);
export default baseRouter;
