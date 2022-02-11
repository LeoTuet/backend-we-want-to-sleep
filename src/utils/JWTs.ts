import jwt from "jsonwebtoken"
import {secrets} from "./secrets";

const jwtPrivateKey = Buffer.from(secrets.JWTPrivateKey, "utf-8")
const jwtPublicKey = Buffer.from(secrets.JWTPublicKey, "utf-8")

const algorithm = "ES256"

export default {
    verifyAccessToken(token: string): boolean {
        try {
            jwt.verify(token, jwtPublicKey, {algorithms: [algorithm]})
        } catch {
            return false
        }
        return true
    },

    // Remember to use try catch to verify token validity
    verifyAndDecodeAccessToken(token: string) {
        return jwt.verify(token, jwtPublicKey, {complete: true, algorithms: [algorithm]})
    },


    generateAccessToken(username: string): string {
        return jwt.sign({username}, jwtPrivateKey, {expiresIn: "1h", algorithm: algorithm})
    }
}