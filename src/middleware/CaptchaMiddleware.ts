import fetch from "node-fetch";
import {secrets} from "../utils/secrets"
import createError from "http-errors";
import {asyncHandler} from "../utils/AsyncHandler";
import {NextFunction, Request} from "express";

const url = "https://hcaptcha.com/siteverify";

export const isCaptchaValid = asyncHandler(async (req: Request<{}, {}, {}>, res, next: NextFunction) => {
    const captchaToken = req.headers['x-captcha'];

    if (!captchaToken) {
        throw createError(403, "Captcha token missing");
    }
    const data = new URLSearchParams([
        ["response", captchaToken.toString()],
        ["secret", secrets.HCAPTCHA_SECRET]
    ])

    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: data.toString()
    });
    const jsonResponse = (await response.json()) as HCaptchaRespone;
    if (!response.ok || !jsonResponse.success) {
        if (jsonResponse["error-codes"]) {
            console.error(`Captcha token was not valid with reason: ${jsonResponse["error-codes"]}`)
        } else {
            console.error(`Captcha API responded with: ${response.status}`)
        }
        throw createError(403, "Captcha token was not valid")
    }

    next();
})

interface HCaptchaRespone {
    "error-codes": string[],
    // quotes needed since "-" is an operator in ts and die HCaptcha API returns it like this (https://docs.hcaptcha.com/)
    success: boolean,
    challenge_ts: string,
    hostname: string,
    credit: boolean
}
