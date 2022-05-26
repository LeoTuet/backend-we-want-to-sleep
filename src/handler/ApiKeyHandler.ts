import { AdminService } from "./../services/AdminService";
import { ApiKeyService } from "../services/ApiKeyService";
import { NotFound, UnprocessableEntity } from "http-errors";

const apiKeyService = new ApiKeyService();
const adminService = new AdminService();

export class ApiKeyHandler {
  public async addApiKey(name: string, createdBy: string) {
    if (!(await adminService.checkIfUsernameExists(createdBy)))
      throw new UnprocessableEntity(
        "There is no admin with the given username"
      );
    if (await apiKeyService.checkIfApiKeyNameExists(name))
      throw new UnprocessableEntity(
        "A api key with the given name already exists"
      );
    return await apiKeyService.addApiKey(name, createdBy);
  }

  public async deleteApiKey(name: string) {
    if (!(await apiKeyService.checkIfApiKeyNameExists(name)))
      throw new NotFound("There is no api key with the given name");
    await apiKeyService.deleteApiKey(name);
  }
}
