import fetch from "node-fetch";
import { secrets } from "../utils/secrets";

const verify_url = "https://hcaptcha.com/siteverify";

interface HCaptchaResponse {
  "error-codes": string[];
  // quotes needed since "-" is an operator in ts and die HCaptcha API returns it like this (https://docs.hcaptcha.com/)
  success: boolean;
  challenge_ts: string;
  hostname: string;
  credit: boolean;
}

export class CaptchaService {
  /**
   * Sends a request to the captcha verify service
   * @throws Error if fetch fails or response code is not 200
   */
  async request(captchaToken: string): Promise<HCaptchaResponse> {
    const data = new URLSearchParams([
      ["response", captchaToken.toString()],
      ["secret", secrets.HCAPTCHA_SECRET],
    ]);

    const response = await fetch(verify_url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    });

    if (!response.ok)
      throw new Error(
        `Captcha service response failed with code ${response.status}: ${response.body}`
      );

    return (await response.json()) as HCaptchaResponse;
  }
}
