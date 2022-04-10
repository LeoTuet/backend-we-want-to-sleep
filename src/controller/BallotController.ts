import { Request } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { BallotHandler } from "../handler/BallotHandler";
import { Ballot } from "../repositories/schemas";
import Joi from "joi";

const ballotHandler = new BallotHandler();

type CreationBallot = Omit<Ballot, "_id">;

type UpdateBallot = Omit<CreationBallot, "createdBy">;

const CreateBallotSchema = Joi.object().keys({
  running: Joi.boolean().required().strict(),
  question: Joi.string().required(),
  options: Joi.array()
    .min(2)
    .items(
      Joi.object().keys({
        identifier: Joi.string().required(),
        label: Joi.string().required(),
      })
    ),
});

export default {
  list: asyncHandler(async (req: Request<{}, {}, {}>, res) => {
    res.json({ data: await ballotHandler.getBallots() });
  }),

  listRunning: asyncHandler(async (req: Request<{}, {}, {}>, res) => {
    res.json({ data: await ballotHandler.getRunningBallot() });
  }),

  add: asyncHandler(
    async (
      req: Request<{}, {}, CreationBallot, {}, { username: string }>,
      res
    ) => {
      Joi.assert(req.body, CreateBallotSchema);
      await ballotHandler.addBallot(
        req.body.running,
        req.res.locals.username,
        req.body.question,
        req.body.options
      );
      res.status(204).send()
    }
  ),

  delete: asyncHandler(async (req: Request<{}, {}, { id: string }>, res) => {
    await ballotHandler.deleteBallot(req.body.id);
    res.statusCode = 204;
  }),
  put: asyncHandler(
    async (req: Request<{ ballotID: string }, {}, UpdateBallot>, res) => {
      Joi.assert(req.body, CreateBallotSchema);
      await ballotHandler.updateBallot(
        req.params.ballotID,
        req.body.running,
        req.body.question,
        req.body.options
      );
      res.status(204).send()
    }
  ),
};
