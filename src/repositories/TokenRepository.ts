import {getCollection} from "./connectToDB";
import {Token} from "./schemas";

export default {
    addToken(token: string, valid: boolean) {
        getCollection("token").insertOne({token: token, valid: valid, createdAt: new Date()})
    },

    deleteToken(token: string) {
        getCollection("token").deleteOne({token})
    },

    async getToken(token: string): Promise<Token> {
        return await getCollection<Token>("token").findOne({token})
    }
}