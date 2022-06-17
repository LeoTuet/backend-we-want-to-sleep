import { Request } from "express";
import asyncHandler from "express-async-handler";
import { BallotHandler } from "../handler/BallotHandler";
import { Ballot } from "../repositories/schemas";
import Joi from "joi";
import { VoteHandler } from "../handler/VoteHandler";

const ballotHandler = new BallotHandler();
const voteHandler = new VoteHandler();

type CreationBallot = Omit<Ballot, "_id" | "tokensUsed" | "createdBy">;

type UpdateBallot = CreationBallot;

// .patter to allow any key with value of type string
const translatableTextSchema = Joi.object({
  de: Joi.string().required(),
  en: Joi.string().required(),
}).pattern(/./, Joi.string());

const creationBallotKeys = {
  running: Joi.boolean().required().strict(),
  question: translatableTextSchema.required(),
  options: Joi.array()
    .min(2)
    .items(
      Joi.object().keys({
        identifier: Joi.string().required(),
        label: translatableTextSchema.required(),
      })
    ),
};

const updateBallotKeys = {
  ...creationBallotKeys,
  _id: Joi.string().length(24),
};

const createBallotSchema = Joi.object().keys(creationBallotKeys);
const updateBallotSchema = Joi.object().keys(updateBallotKeys);

const ballotIdSchema = Joi.object().keys({
  ballotID: Joi.string().length(24).required(),
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
      req: Request<{}, {}, CreationBallot, {}>,
      res
    ) => {
      Joi.assert(req.body, createBallotSchema);
      const ballot = await ballotHandler.addBallot(
        req.body.running,
        req.res.locals.username,
        req.body.question,
        req.body.options
      );
      res.json({ data: ballot });
    }
  ),

  delete: asyncHandler(
    async (req: Request<{ ballotID: string }, {}, {}>, res) => {
      Joi.assert(req.params, ballotIdSchema);
      await ballotHandler.deleteBallot(req.params.ballotID);
      res.status(204).send();
    }
  ),

  put: asyncHandler(
    async (req: Request<{ ballotID: string }, {}, UpdateBallot>, res) => {
      Joi.assert(req.params, ballotIdSchema);
      Joi.assert(req.body, updateBallotSchema);
      const ballot = await ballotHandler.updateBallot(
        req.params.ballotID,
        req.body.running,
        req.body.question,
        req.body.options
      );
      res.json({ data: ballot });
    }
  ),
  getVoteResult: asyncHandler(
    async (req: Request<{ ballotID: string }, {}, {}>, res) => {
      Joi.assert(req.params, ballotIdSchema);
      const result = await voteHandler.getVoteResult(req.params.ballotID);
      res.json({
        data: result,
      });
    }
  ),
  getTotalVoteCount: asyncHandler(
    async (req: Request<{ ballotID: string }, {}, {}>, res) => {
      Joi.assert(req.params, ballotIdSchema);
      const totalCount = await voteHandler.getTotalVoteCount(
        req.params.ballotID
      );
      res.json({
        data: totalCount,
      });
    }
  ),
};
