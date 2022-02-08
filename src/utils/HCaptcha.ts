import fetch from "node-fetch";
import {secrets} from "./secrets"
import createError from "http-errors";

export default {

    async ensureValid(token: string) {
        const url = "https://hcaptcha.com/siteverify";
        const data = {
            response: token,
            secret: secrets.HCAPTCHA_SECRET
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: JSON.stringify(data)
        });
        const jsonResponse = (await response.json()) as HCaputureRespone;
        if (!response.ok || !jsonResponse.success) {
            console.error("Captcha was not valid")
            throw createError(403)
        }
    }

}

interface HCaputureRespone {
    success: boolean,
    challenge_ts: string,
    hostname: string,
    credit: boolean,
}
