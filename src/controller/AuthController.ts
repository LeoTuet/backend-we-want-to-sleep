import { Request } from "express";
import Joi from "joi";
import { asyncHandler } from "../utils/AsyncHandler";
import { AuthHandler } from "../handler/AuthHandler";

const authHandler = new AuthHandler();

export const loginSchema = Joi.object().keys({
  username: Joi.string().required().alphanum(),
  password: Joi.string().required(),
});

export default {
  login: asyncHandler(
    async (
      req: Request<{}, {}, { username: string; password: string }>,
      res
    ) => {
      Joi.assert(req.body, loginSchema);
      const accessToken = await authHandler.login(
        req.body.username,
        req.body.password
      );
      res.json({
        data: {
          accessToken: accessToken,
        },
      });
    }
  ),
};
