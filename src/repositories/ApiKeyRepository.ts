import { getCollection } from "./connectToDB";
import { ApiKey } from "./schemas";

export default {
  async addApiKey(name: string, key: string) {
    const result = await getCollection("api-key").insertOne({
      name,
      key,
    });
    if (!result.acknowledged) throw Error("Api key could not be created");
  },

  async deleteApiKey(name: string) {
    const result = await getCollection("api-key").deleteOne({ name });
    if (result.deletedCount !== 1) throw Error("Api key could not be deleted");
  },

  async getApiKeyByKey(key: string): Promise<ApiKey> {
    return await getCollection<ApiKey>("api-key").findOne({ key });
  },

  async getApiKeyByName(name: string): Promise<ApiKey> {
    return await getCollection<ApiKey>("api-key").findOne({ name });
  },
};
