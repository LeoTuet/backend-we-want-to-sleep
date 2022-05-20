import { getCollection } from "./connectToDB";
import { Admin } from "./schemas";

export default {
  async addAdmin(username: string, passwordHash: string) {
    const result = await getCollection("admin").insertOne({
      username,
      passwordHash,
    });
    if (!result.acknowledged) {
      throw Error("Admin could not be created");
    }
  },

  async deleteAdmin(username: string) {
    const result = await getCollection("admin").deleteOne({ username });
    if (result.deletedCount !== 1) {
      throw Error("Admin could not be deleted");
    }
  },

  async getAdmin(username: string): Promise<Admin> {
    return await getCollection<Admin>("admin").findOne({ username });
  },
};
