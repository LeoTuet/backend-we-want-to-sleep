import { Request } from "express";
import Joi from "joi";
import { asyncHandler } from "../utils/AsyncHandler";
import { TokenHandler } from "../handler/TokenHandler";

const tokenHandler = new TokenHandler();

const tokenStatusSchema = Joi.object().keys({
  ballotID: Joi.string().required(),
  token: Joi.string()
    .regex(/[0-9A-Z]{4}[-][0-9A-Z]{4}[-][0-9A-Z]{4}/)
    .required(),
});

const tokenGenerationSchema = Joi.object().keys({
  amount: Joi.number().positive().required(),
  valid: Joi.boolean().strict(),
});

export default {
  getStatus: asyncHandler(
    async (req: Request<{ ballotID: string; token: string }, {}, {}>, res) => {
      Joi.assert(req.params, tokenStatusSchema);

      res.json({
        data: await tokenHandler.getTokenStatus(
          req.params.token,
          req.params.ballotID
        ),
      });
    }
  ),
  generate: asyncHandler(
    async (
      req: Request<
        {},
        {},
        { amount: number; valid: boolean },
        {},
        { username: string }
      >,
      res
    ) => {
      Joi.assert(req.body, tokenGenerationSchema);
      res.json({
        data: await tokenHandler.generateTokens(
          req.body.amount,
          req.body.valid ?? true,
          req.res.locals.username
        ),
      });
    }
  ),
};
