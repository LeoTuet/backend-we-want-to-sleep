import {NextFunction, Request} from "express";
import {Forbidden, Unauthorized} from "http-errors";
import JWTs from "../utils/JWTs";
import {asyncHandler} from "../utils/AsyncHandler";
import {JwtPayload, TokenExpiredError} from "jsonwebtoken";
import {AdminService} from "../services/AdminService";

const adminService = new AdminService()

export const isAdmin = asyncHandler(async (req: Request<{}, {}, {}>, res, next: NextFunction) => {
  let jwt = req.headers.authorization
  let decodedJwt: JwtPayload

  if (!jwt)
    throw new Unauthorized("AccessToken missing")

  if (jwt.toLowerCase().startsWith('bearer'))
    jwt = jwt.slice('bearer'.length).trim();

  try {
    decodedJwt = JWTs.verifyAndDecodeAccessToken(jwt)
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      throw new Unauthorized("AccessToken expired")
    } else {
      throw new Unauthorized("AccessToken invalid")
    }
  }
  if (!await adminService.checkIfUsernameExists(decodedJwt.payload.username))
    throw new Forbidden()

  res.locals.authenticated = true
  res.locals.username = decodedJwt.payload.username
  next()
})