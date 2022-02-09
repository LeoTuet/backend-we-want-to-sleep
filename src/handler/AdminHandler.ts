import {AdminService} from "../services/AdminService";
import JWTs from "../utils/JWTs";
import {Forbidden} from "http-errors";

const adminService = new AdminService();

export class AdminHandler {
  public async login(username: string, password: string): Promise<string> {
    if (!await adminService.checkIfUsernameExists(username))
      throw new Forbidden("Incorrect username or password")
    if (!await adminService.checkIfPasswordCorrect(username, password))
      throw new Forbidden("Incorrect username or password")
    return JWTs.generateAccessToken(username)
  }
}
