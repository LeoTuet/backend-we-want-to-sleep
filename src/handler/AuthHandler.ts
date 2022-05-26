import { ApiKeyService } from './../services/ApiKeyService';
import { Forbidden, Unauthorized } from "http-errors";
import { JwtPayload } from "jsonwebtoken";
import { AdminService } from "../services/AdminService";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();
const apiKeyService = new ApiKeyService()
const adminService = new AdminService();

export class AuthHandler {
  public async authenticate(jwt: string): Promise<JwtPayload> {
    if (!jwt) throw new Unauthorized("AccessToken missing");

    let decodedJwt: JwtPayload;
    try {
      decodedJwt = authService.decodeJWT(jwt);
    } catch (e) {
      throw new Forbidden(e.message);
    }

    const subjectExists = await adminService.checkIfUsernameExists(
      decodedJwt.payload.username
    );
    if (!subjectExists) throw new Forbidden("Invalid Subject");

    return decodedJwt;
  }

  async authenticateWithApiKey(key: string): Promise<boolean> {
    if (!(await apiKeyService.checkIfApiKeyExists(key)))
      throw new Unauthorized("API key is not valid");
    return true;
  }

  public async login(username: string, password: string): Promise<string> {
    if (!username || !password)
      throw new Unauthorized("Missing username or password");
    if (!(await adminService.checkCredentials(username, password)))
      throw new Forbidden("Incorrect username or password");

    return authService.generateJWT(username);
  }
}
