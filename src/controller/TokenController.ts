import {Request} from "express";
import {asyncHandler} from "../utils/AsyncHandler";
import {TokenHandler} from "../handler/TokenHandler";

const tokenHandler = new TokenHandler()

export default {
  getStatus: asyncHandler(async (req: Request<{ ballotID: string, token: string }, {}, {}>, res, next) => {
    res.json(await tokenHandler.getTokenStatus(req.params.token, req.params.ballotID));
  }),
}