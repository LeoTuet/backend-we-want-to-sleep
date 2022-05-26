import { getCollection } from "./connectToDB";
import { ApiKey } from "./schemas";

export default {
  async addApiKey(
    name: string,
    keyHash: string,
    createdBy: string,
    createdAt: Date
  ) {
    const result = await getCollection("api-key").insertOne({
      name,
      keyHash,
      createdBy,
      createdAt,
    });
    if (!result.acknowledged) throw Error("Api key could not be created");
  },

  async deleteApiKey(name: string) {
    const result = await getCollection("api-key").deleteOne({ name });
    if (result.deletedCount !== 1) throw Error("Api key could not be deleted");
  },

  async getApiKeyByKeyHash(keyHash: string): Promise<ApiKey> {
    return await getCollection<ApiKey>("api-key").findOne({ keyHash });
  },

  async getApiKeyByName(name: string): Promise<ApiKey> {
    return await getCollection<ApiKey>("api-key").findOne({ name });
  },
};
