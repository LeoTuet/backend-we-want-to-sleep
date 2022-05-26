import sha256 from "crypto-js/sha256";
import ApiKeyRepository from "../repositories/ApiKeyRepository";
import { nanoid } from "nanoid";

export class ApiKeyService {
  public async addApiKey(name: string, createdBy: string) {
    const key = this.generateApiKey();

    if (this.checkIfApiKeyExists(key)) this.addApiKey(name, createdBy);

    const keyHash = sha256(key).toString();
    const createdAt = new Date();

    await ApiKeyRepository.addApiKey(name, keyHash, createdBy, createdAt);
    return key;
  }

  public deleteApiKey = ApiKeyRepository.deleteApiKey;

  public generateApiKey() {
    return nanoid(20);
  }

  public async checkIfApiKeyNameExists(name: string): Promise<boolean> {
    const apiKey = await ApiKeyRepository.getApiKeyByName(name);
    return apiKey != null;
  }

  public async checkIfApiKeyExists(key: string): Promise<boolean> {
    const hashedKey = sha256(key).toString();
    const apiKey = await ApiKeyRepository.getApiKeyByKeyHash(hashedKey);
    return apiKey != null;
  }
}
