import { Request } from "express";
import Joi from "joi";
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiKeyHandler } from "../handler/ApiKeyHandler";

const apiKeyHandler = new ApiKeyHandler();

export const apiKeyRaw = Joi.object().keys({
  name: Joi.string().required().alphanum(),
  key: Joi.string().required(),
});

export default {
  add: asyncHandler(
    async (req: Request<{}, {}, { name: string; key: string }>, res) => {
      Joi.assert(req.body, apiKeyRaw);

      await apiKeyHandler.addApiKey(req.body.name, req.body.key);
      res.json({
        data: {
          added: req.body.name,
        },
      });
    }
  ),
  delete: asyncHandler(async (req: Request<{}, {}, { name: string }>, res) => {
    Joi.assert(req.body.name, Joi.string().required().alphanum());

    await apiKeyHandler.deleteApiKey(req.body.name);
    res.status(204).send();
  }),
};
