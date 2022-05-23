import { NextFunction, Request } from "express";
import { asyncHandler } from "../utils/AsyncHandler";
import { AuthHandler } from "../handler/AuthHandler";

const authHandler = new AuthHandler();

export const isAdmin = asyncHandler(
  async (req: Request<{}, {}, {}>, res, next: NextFunction) => {
    const decoded = await authHandler.authenticate(req.headers.authorization);

    res.locals.authenticated = true;
    res.locals.username = decoded.payload.username;
    next();
  }
);
