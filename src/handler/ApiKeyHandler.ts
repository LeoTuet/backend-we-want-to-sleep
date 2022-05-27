import { AdminService } from "../services/AdminService";
import { ApiKeyService } from "../services/ApiKeyService";
import { NotFound, UnprocessableEntity } from "http-errors";
import { ApiKey } from "../repositories/schemas";

const apiKeyService = new ApiKeyService();
const adminService = new AdminService();

type ApiKeyInfo = Omit<ApiKey, "keyHash" | "_id">;

const convertApiKey = (key: ApiKey): ApiKeyInfo => {
  delete key.keyHash;
  delete key._id;
  return key;
};

const convertApiKeys = (keys: ApiKey[]): ApiKeyInfo[] => {
  return keys.map(convertApiKey);
};

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
    return await apiKeyService.createUniqueApiKey(name, createdBy);
  }

  public async deleteApiKey(name: string) {
    if (!(await apiKeyService.checkIfApiKeyNameExists(name)))
      throw new NotFound("There is no api key with the given name");
    await apiKeyService.deleteApiKey(name);
  }

  async getApiKeys(): Promise<ApiKeyInfo[]> {
    return convertApiKeys(await apiKeyService.getApiKeys());
  }
}
