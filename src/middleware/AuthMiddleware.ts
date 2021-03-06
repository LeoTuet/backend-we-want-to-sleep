import { NextFunction, Request } from "express";
import asyncHandler from "express-async-handler";
import { AuthHandler } from "../handler/AuthHandler";

const authHandler = new AuthHandler();

export const isAdmin = asyncHandler(
  async (req: Request<{}, {}, {}>, res, next: NextFunction) => {
    const decoded = await authHandler.authenticateWithJwt(
      req.headers.authorization
    );

    res.locals.authenticated = true;
    res.locals.username = decoded.payload.username;
    next();
  }
);

export const hasValidApiKey = asyncHandler(
  async (req: Request<{}, {}, {}>, res, next: NextFunction) => {
    await authHandler.authenticateWithApiKey(
      req.headers["x-api-key"].toString()
    );
    next();
  }
);
