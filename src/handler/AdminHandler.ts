import { AdminService } from "../services/AdminService";
import JWTs from "../utils/JWTs";
import {
  Forbidden,
  NotFound,
  Unauthorized,
  UnprocessableEntity,
} from "http-errors";

const adminService = new AdminService();

export class AdminHandler {
  // old implementation
  public async login(username: string, password: string): Promise<string> {
    if (!username || !password)
      throw new Unauthorized("Missing username or password");
    if (!(await adminService.checkCredentials(username, password)))
      throw new Forbidden("Incorrect username or password");

    return JWTs.generateAccessToken(username);
  }
  public async addAdmin(username: string, password: string) {
    if (await adminService.checkIfUsernameExists(username))
      throw new UnprocessableEntity("User with the given name already exists");

    await adminService.addAdmin(username, password);
  }

  public async deleteAdmin(username: string) {
    if (!(await adminService.checkIfUsernameExists(username)))
      throw new NotFound("There is no user with the given username");

    await adminService.deleteAdmin(username);
  }
}
