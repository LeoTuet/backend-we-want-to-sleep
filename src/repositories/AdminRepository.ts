import {getCollection} from "./connectToDB";
import {Admin} from "./schemas";

export default {
  addAdmin(username: string, passwordHash: string) {
    getCollection("admin").insertOne({username, passwordHash});
  },

  deleteAdmin(username: string) {
    getCollection("admin").deleteOne({username});
  },

  async getAdmin(username: string): Promise<Admin> {
    return await getCollection<Admin>("admin").findOne({username})
  }
};
