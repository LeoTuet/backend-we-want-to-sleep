import { Request } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { BallotHandler } from "../handler/BallotHandler";
import { secrets } from "../utils/secrets";
import createHttpError from "http-errors";
import { Ballot } from "../repositories/schemas";

const ballotHandler = new BallotHandler();

 //JUST FOR TESTING BECAUSE WE NOT HAVE JWTs JET
interface CreationBallot extends Omit<Ballot, "_id"> {
  password: string;
}

export default {
  list: asyncHandler(async (req: Request<{}, {}, {}>, res, next) => {
    res.json({ data: await ballotHandler.getBallots() });
  }),

  listRunning: asyncHandler(async (req: Request<{}, {}, {}>, res, next) => {
    res.json({ data: await ballotHandler.getRunningBallot() });
  }),

  add: asyncHandler(async (req: Request<{}, {}, CreationBallot>, res, next) => {
    //JUST FOR TESTING BECAUSE WE NOT HAVE JWTs JET
    if (req.body.password != secrets.PROVISIONAL_ADMIN_PASSWORD) {
      throw new createHttpError.Forbidden();
    }
    res.json({
      data: await ballotHandler.addBallot(req.body.running, req.body.options),
    });
  }),

  delete: asyncHandler(
    async (req: Request<{}, {}, { id: string; password: string }>, res) => {
      //JUST FOR TESTING BECAUSE WE NOT HAVE JWTs JET
      if (req.body.password != secrets.PROVISIONAL_ADMIN_PASSWORD) {
        throw new createHttpError.Forbidden();
      }
      res.json({ data: await ballotHandler.deleteBallot(req.body.id) });
    }
  ),
};
