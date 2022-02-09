import { Request } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { BallotHandler } from "../handler/BallotHandler";

const ballotHandler = new BallotHandler();

export default {
  list: asyncHandler(async (req: Request<{}, {}, {}>, res, next) => {
    res.json({ data: await ballotHandler.getBallots() });
  }),

  listRunning: asyncHandler(async (req: Request<{}, {}, {}>, res, next) => {
    res.json({ data: await ballotHandler.getRunningBallot() });
  }),
};
