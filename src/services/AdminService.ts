import AdminRepository from "../repositories/AdminRepository";
import { compare, hash } from "bcrypt";

export class AdminService {
  public deleteAdmin = AdminRepository.deleteAdmin;

  public async addAdmin(username: string, password: string) {
    await AdminRepository.addAdmin(username, await hash(password, 12));
  }

  public async checkCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const admin = await AdminRepository.getAdmin(username);
    if (!admin) return false;

    return await compare(password, admin.passwordHash);
  }

  public async checkIfUsernameExists(username: string): Promise<boolean> {
    const admin = await AdminRepository.getAdmin(username);
    return admin != null;
  }
}
