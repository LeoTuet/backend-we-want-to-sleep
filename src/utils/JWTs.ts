import jwt from "jsonwebtoken"
import {secrets} from "./secrets";

const JWTSecret = secrets.JWTSecret || "test"

export default {
  verifyAccessToken(token: string): boolean {
    try {
      jwt.verify(token, JWTSecret)
    } catch {
      return false
    }
    return true
  },

  // Remember to use try catch to verify token validity
  verifyAndDecodeAccessToken(token: string) {
    return jwt.verify(token, JWTSecret, {complete: true})
  },


  generateAccessToken(username: string): string {
    return jwt.sign({username}, JWTSecret, {expiresIn: "1h"})
  }
}