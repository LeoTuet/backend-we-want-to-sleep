import {Request} from "express";
import Joi from "joi";
import {asyncHandler} from "../utils/AsyncHandler";
import {AdminHandler} from "../handler/AdminHandler";

const adminHandler = new AdminHandler();

export const adminCredsRaw = Joi.object().keys({
  username: Joi.string().required().alphanum(),
  password: Joi.string().required(),
});

export default {
  login: asyncHandler(
    async (req: Request<{}, {}, { username: string, password: string }>, res) => {
      Joi.assert(req.body, adminCredsRaw)

      res.json({
        data: {
          accessToken: await adminHandler.login(req.body.username, req.body.password)
        }
      })
    }
  ),
  add: asyncHandler(
    async (req: Request<{}, {}, { username: string, password: string }>, res) => {
      Joi.assert(req.body, adminCredsRaw)

      await adminHandler.addAdmin(req.body.username, req.body.password)
      res.json({
        data: {
          added: req.body.username
        }
      })
    }
  ),
  delete: asyncHandler(
    async (req: Request<{}, {}, { username: string }>, res) => {
      Joi.assert(req.body.username, Joi.string().required().alphanum())

      await adminHandler.deleteAdmin(req.body.username)
      res.json({
        data: {
          deleted: req.body.username
        }
      })
    }
  )
};
