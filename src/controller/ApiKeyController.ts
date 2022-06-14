import { Request } from "express";
import Joi from "joi";
import asyncHandler from "express-async-handler";
import { ApiKeyHandler } from "../handler/ApiKeyHandler";

const apiKeyHandler = new ApiKeyHandler();

export default {
  add: asyncHandler(async (req: Request<{}, {}, { name: string }>, res) => {
    Joi.assert(req.body.name, Joi.string().required().alphanum());

    const apiKey = await apiKeyHandler.addApiKey(
      req.body.name,
      req.res.locals.username
    );
    res.json({
      data: {
        name: req.body.name,
        key: apiKey,
      },
    });
  }),
  delete: asyncHandler(async (req: Request<{}, {}, { name: string }>, res) => {
    Joi.assert(req.body.name, Joi.string().required().alphanum());

    await apiKeyHandler.deleteApiKey(req.body.name);
    res.status(204).send();
  }),
  getApiKeys: asyncHandler(
    async (req: Request<{}, {}, { name: string }>, res) => {
      const apiKeys = await apiKeyHandler.getApiKeys();
      res.json({
        data: apiKeys,
      });
    }
  ),
};
