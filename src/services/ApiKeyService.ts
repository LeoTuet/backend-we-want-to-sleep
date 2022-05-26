import ApiKeyRepository from "../repositories/ApiKeyRepository";

export class ApiKeyService {
  public addApiKey = ApiKeyRepository.addApiKey;

  public deleteApiKey = ApiKeyRepository.deleteApiKey;

  public async checkIfApiKeyNameExists(name: string): Promise<boolean> {
    const apiKey = await ApiKeyRepository.getApiKeyByName(name);
    return apiKey != null;
  }
}
