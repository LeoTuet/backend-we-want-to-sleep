import jwt, { JwtPayload } from "jsonwebtoken";
import { secrets } from "../utils/secrets";

const jwtPrivateKey = `-----BEGIN EC PRIVATE KEY-----\n${secrets.JWTPrivateKey}\n-----END EC PRIVATE KEY-----`;
const jwtPublicKey = `-----BEGIN PUBLIC KEY-----\n${secrets.JWTPublicKey}\n-----END PUBLIC KEY-----`;
const algorithm = "ES256";

export class AuthService {
  public decodeJWT(token: string): JwtPayload {
    if (token.toLowerCase().startsWith("bearer"))
      token = token.slice("bearer".length);

    return jwt.verify(token.trim(), jwtPublicKey, {
      complete: true,
      algorithms: [algorithm],
    });
  }

  public generateJWT(username: string): string {
    return jwt.sign({ username }, jwtPrivateKey, {
      expiresIn: "1h",
      algorithm: algorithm,
    });
  }
}
