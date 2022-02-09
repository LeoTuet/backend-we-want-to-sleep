import {Request} from "express";
import Joi from "joi";
import {asyncHandler} from "../utils/AsyncHandler";
import {AdminHandler} from "../handler/AdminHandler";

const adminHandler = new AdminHandler();

export const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  login: asyncHandler(
    async (req: Request<{}, {}, { username: string, password: string }>, res) => {
      Joi.assert(req.body, loginSchema)

      res.json({
        data: {
          accessToken: await adminHandler.login(req.body.username, req.body.password)
        }
      })
    }
  )
};
