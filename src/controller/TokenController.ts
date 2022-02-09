import { Request } from "express";
import Joi from "joi";
import { asyncHandler } from "../utils/AsyncHandler";
import { TokenHandler } from "../handler/TokenHandler";

const tokenHandler = new TokenHandler();

export const tokenStatusSchema = Joi.object().keys({
  ballotID: Joi.string().required(),
  token: Joi.string()
    .regex(/[0-9A-Z]{4}[-][0-9A-Z]{4}[-][0-9A-Z]{4}/)
    .required(),
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
};
