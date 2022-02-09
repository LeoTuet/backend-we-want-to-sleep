import { Request } from "express";
import { VoteHandler } from "../handler/VoteHandler";
import { asyncHandler } from "../utils/AsyncHandler";

const voteHandler = new VoteHandler();

export default {
  add: asyncHandler(
    async (
      req: Request<{ ballotID: string }, {}, { token: string; vote: string }>,
      res,
      next
    ) => {
      await voteHandler.saveVote(
        req.body.token,
        req.params.ballotID,
        req.body.vote,
        req.headers["X-Captcha"].toString()
      );

      res.status(204).send();
    }
  ),

  get: asyncHandler(
    async (
      req: Request<{ ballotID: string; token: string }, {}, {}>,
      res,
      next
    ) => {
      const { _id, token, ...vote } = await voteHandler.getVote(
        req.params.token,
        req.params.ballotID
      );
      res.json({ data: vote });
    }
  ),
};
