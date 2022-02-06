import {ObjectId} from "mongodb";

export interface Vote {
  _id: ObjectId;
  token: string;
  ballotID: ObjectId;
  vote: string;
  votedAt: Date;
}

export interface Ballot {
  _id: ObjectId;
  running: boolean;
  options: string[];
}

export interface Token {
  _id: ObjectId;
  token: string;
  valid: boolean;
  createdAt: Date;
}