import { ApiKeyService } from "../services/ApiKeyService";
import { NotFound, UnprocessableEntity } from "http-errors";

const apiKeyService = new ApiKeyService();

export class ApiKeyHandler {
  public async addApiKey(name: string, key: string) {
    if (await apiKeyService.checkIfApiKeyNameExists(name))
      throw new UnprocessableEntity(
        "A api key with the given name already exists"
      );

    await apiKeyService.addApiKey(name, key);
  }

  public async deleteApiKey(name: string) {
    if (!(await apiKeyService.checkIfApiKeyNameExists(name)))
      throw new NotFound("There is no api key with the given name");

    await apiKeyService.deleteApiKey(name);
  }
}
