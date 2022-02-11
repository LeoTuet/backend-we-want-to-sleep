import {getCollection} from "./connectToDB";
import {Admin} from "./schemas";
import createError from "http-errors";

export default {
    addAdmin(username: string, passwordHash: string) {
        getCollection("admin").insertOne({username, passwordHash});
    },

    async deleteAdmin(username: string) {
        const result = await getCollection("admin").deleteOne({username})
        if (result.deletedCount !== 1) {
            throw createError(500, "Unable to delete Admin")
        }
    },

    async getAdmin(username: string): Promise<Admin> {
        return await getCollection<Admin>("admin").findOne({username})
    }
};
