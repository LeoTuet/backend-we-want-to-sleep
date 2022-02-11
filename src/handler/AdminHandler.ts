import {AdminService} from "../services/AdminService";
import JWTs from "../utils/JWTs";
import {Forbidden, UnprocessableEntity} from "http-errors";

const adminService = new AdminService();

export class AdminHandler {
  public async login(username: string, password: string): Promise<string> {
    if (!await adminService.checkIfUsernameExists(username))
      throw new Forbidden("Incorrect username or password")
    if (!await adminService.checkIfPasswordCorrect(username, password))
      throw new Forbidden("Incorrect username or password")
    return JWTs.generateAccessToken(username)
  }
  public async addAdmin(username: string, password: string) {
    if (await adminService.checkIfUsernameExists(username))
      throw new UnprocessableEntity("User with the given name already exists")
    await adminService.addAdmin(username, password)
  }

  public async deleteAdmin(username: string) {
    if (!await adminService.checkIfUsernameExists(username))
      throw new UnprocessableEntity("There is no user with the given username")
    await adminService.deleteAdmin(username)
  }
}
