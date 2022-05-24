import { asyncHandler } from "../utils/AsyncHandler";
import { NextFunction, Request } from "express";
import { CaptchaHandler } from "../handler/CaptchaHandler";

const captchaHandler = new CaptchaHandler();

export const isCaptchaValid = asyncHandler(
  async (req: Request<{}, {}, {}>, res, next: NextFunction) => {
    const captchaToken = req.headers["x-captcha"] as string;
    await captchaHandler.verify(captchaToken);
    next();
  }
);