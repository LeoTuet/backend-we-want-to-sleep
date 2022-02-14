import {getCollection} from "./connectToDB";
import {Token} from "./schemas";

export default {
  addToken(token: string, valid: boolean, createdBy: string, createdAt: Date) {
    getCollection("token").insertOne({
      token: token,
      valid: valid,
      createdBy,
      createdAt
    });
  },

  async addTokens(tokens: Omit<Token, "_id">[]) {
    const result = await getCollection("token").insertMany(tokens);
    if (result.insertedCount != tokens.length)
      throw Error("Amount of inserted tokens did not match the amount of given tokens")
  },

  deleteToken(token: string) {
    getCollection("token").deleteOne({token});
  },

  async getToken(token: string): Promise<Token> {
    return await getCollection<Token>("token").findOne({token});
  },
};
