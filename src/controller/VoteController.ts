import { Request } from "express";
import Joi from "joi";
import { VoteHandler } from "../handler/VoteHandler";
import { asyncHandler } from "../utils/AsyncHandler";

const voteHandler = new VoteHandler();

export const voteAddParamsSchema = Joi.object().keys({
  ballotID: Joi.string().required(),
});

export const voteAddBodySchema = Joi.object().keys({
  token: Joi.string()
    .regex(/[0-9A-Z]{4}[-][0-9A-Z]{4}[-][0-9A-Z]{4}/)
    .required(),
  vote: Joi.string().required(),
});

export const voteGetParamsSchema = Joi.object().keys({
  ballotID: Joi.string().required(),
  token: Joi.string()
    .regex(/[0-9A-Z]{4}[-][0-9A-Z]{4}[-][0-9A-Z]{4}/)
    .required(),
});

export default {
  add: asyncHandler(
    async (
      req: Request<{ ballotID: string }, {}, { token: string; vote: string }>,
      res
    ) => {
      Joi.assert(req.params, voteAddParamsSchema);
      Joi.assert(req.body, voteAddBodySchema);

      await voteHandler.saveVote(
        req.body.token,
        req.params.ballotID,
        req.body.vote,
      );

      res.status(204).send();
    }
  ),

  get: asyncHandler(
    async (req: Request<{ ballotID: string; token: string }, {}, {}>, res) => {
      Joi.assert(req.params, voteGetParamsSchema);

      const { _id, token, ...vote } = await voteHandler.getVote(
        req.params.token,
        req.params.ballotID
      );
      res.json({ data: vote });
    }
  ),
};
