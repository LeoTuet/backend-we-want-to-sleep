import {NextFunction, Request} from "express";
import {Forbidden, Unauthorized} from "http-errors";
import JWTs from "./JWTs";
import {asyncHandler} from "./AsyncHandler";
import {JwtPayload} from "jsonwebtoken";
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
  } catch {
    throw new Unauthorized("AccessToken expired")
  }

  if (!await adminService.checkIfUsernameExists(decodedJwt.payload.username))
    throw new Forbidden()

  res.locals.authenticated = true
  res.locals.username = decodedJwt.username
  next()
})