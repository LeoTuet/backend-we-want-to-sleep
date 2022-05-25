import { getCollection } from "./connectToDB";
import { Token } from "./schemas";

export default {
  async addToken(
    token: string,
    valid: boolean,
    createdBy: string,
    createdAt: Date
  ) {
    const result = await getCollection("token").insertOne({
      token: token,
      valid: valid,
      createdBy,
      createdAt,
    });

    if (!result.acknowledged) throw Error("Token could not be created");
  },

  async addTokens(tokens: Omit<Token, "_id">[]) {
    const result = await getCollection("token").insertMany(tokens);

    if (result.insertedCount != tokens.length)
      throw Error(
        "Amount of inserted tokens did not match the amount of given tokens"
      );
  },

  async deleteToken(token: string) {
    const result = await getCollection("token").deleteOne({ token });

    if (result.deletedCount !== 1) throw Error("Token could not be deleted");
  },

  async getToken(token: string): Promise<Token> {
    return await getCollection<Token>("token").findOne({ token });
  },
};
