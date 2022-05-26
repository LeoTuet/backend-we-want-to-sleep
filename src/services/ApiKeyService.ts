import sha256 from "crypto-js/sha256";
import ApiKeyRepository from "../repositories/ApiKeyRepository";
import { nanoid } from "nanoid";

function generateApiKey() {
  return nanoid(20);
}

export class ApiKeyService {
  public async addApiKey(name: string, createdBy: string) {
    const key = generateApiKey();

    if (await this.checkIfApiKeyExists(key)) {
      await this.addApiKey(name, createdBy);
      return;
    }

    const keyHash = sha256(key).toString();
    const createdAt = new Date();

    await ApiKeyRepository.addApiKey(name, keyHash, createdBy, createdAt);
    return key;
  }

  public deleteApiKey = ApiKeyRepository.deleteApiKey;

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
