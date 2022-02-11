import { Request } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { BallotHandler } from "../handler/BallotHandler";
import { Ballot } from "../repositories/schemas";

const ballotHandler = new BallotHandler();

type CreationBallot = Omit<Ballot, "_id">

export default {
  list: asyncHandler(async (req: Request<{}, {}, {}>, res) => {
    res.json({ data: await ballotHandler.getBallots() });
  }),

  listRunning: asyncHandler(async (req: Request<{}, {}, {}>, res) => {
    res.json({ data: await ballotHandler.getRunningBallot() });
  }),

  add: asyncHandler(async (req: Request<{}, {}, CreationBallot>, res) => {
    res.json({
      data: await ballotHandler.addBallot(req.body.running, req.body.options),
    });
  }),

  delete: asyncHandler(
    async (req: Request<{}, {}, { id: string; password: string }>, res) => {
      res.json({ data: await ballotHandler.deleteBallot(req.body.id) });
    }
  ),
};
