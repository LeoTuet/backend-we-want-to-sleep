import {getCollection} from "./connectToDB";
import {Ballot} from "./schemas";
import {ObjectId} from "mongodb";

export default {
  addBallot(running: boolean, options: string[]) {
    getCollection("ballot").insertOne({running, options})
  },

  deleteBallot(ballotID: string) {
    getCollection("ballot").deleteOne({_id: new ObjectId(ballotID)})
  },

  async getBallot(ballotID: string): Promise<Ballot> {
    return await getCollection("ballot").findOne({_id: new ObjectId(ballotID)})
  },

  async getBallots(): Promise<Ballot[]> {
    return await getCollection<Ballot>("ballot").find().toArray()
  },

  async getRunningBallots(): Promise<Ballot[]> {
    return await getCollection<Ballot>("ballot").find({running: true}).toArray()
  }
}