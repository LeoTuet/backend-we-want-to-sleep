import AdminRepository from "../repositories/AdminRepository";
import {compare, hash} from "bcrypt";


export class AdminService {

  public async addAdmin(username: string, password: string) {
    AdminRepository.addAdmin(
      username,
      await hash(password, 10)
    )
  };

  public deleteAdmin = AdminRepository.deleteAdmin;

  public async checkIfPasswordCorrect(username: string, password: string): Promise<boolean> {
    return await compare(
      password,
      (await AdminRepository.getAdmin(username)).passwordHash
    )
  }

  public async checkIfUsernameExists(username: string): Promise<boolean> {
    return (await AdminRepository.getAdmin(username)) != null
  }
}