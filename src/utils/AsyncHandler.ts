import { RequestHandler, Request, NextFunction } from "express";

export const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request<{}, {}, {}>, res: any, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
