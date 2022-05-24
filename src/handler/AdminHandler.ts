import { AdminService } from "../services/AdminService";
import { NotFound, UnprocessableEntity } from "http-errors";

const adminService = new AdminService();

export class AdminHandler {
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
