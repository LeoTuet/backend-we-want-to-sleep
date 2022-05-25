import { Forbidden, ServiceUnavailable } from "http-errors";
import { CaptchaService } from "../services/CaptchaService";
import logger from "jet-logger";
import { response } from "express";

const captchaService = new CaptchaService();

export class CaptchaHandler {
  async verify(captchaToken: string) {
    if (!captchaToken) throw new Forbidden("Captcha token missing");

    const jsonResponse = await captchaService
      .request(captchaToken)
      .catch((err) => {
        logger.err(err);
        throw new ServiceUnavailable("Captcha service unavailable");
      });

    if (jsonResponse.success) return;

    const codes = jsonResponse["error-codes"];
    logger.warn(`Captcha verify denied: ${codes || response.status}`);
    throw new Forbidden("Captcha token was not valid");
  }
}
