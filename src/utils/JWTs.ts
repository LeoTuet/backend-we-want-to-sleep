import jwt from "jsonwebtoken"
import {secrets} from "./secrets";

const jwtPrivateKey = `-----BEGIN EC PRIVATE KEY-----\n${secrets.JWTPrivateKey}\n-----END EC PRIVATE KEY-----`
const jwtPublicKey = `-----BEGIN PUBLIC KEY-----\n${secrets.JWTPublicKey}\n-----END PUBLIC KEY-----`
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
