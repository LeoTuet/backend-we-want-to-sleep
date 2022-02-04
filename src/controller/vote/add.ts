import {Request, RequestHandler} from "express";
import {VoteHandler} from "../../handler/VoteHandler";

const voteHandler = new VoteHandler()
export const add: RequestHandler = async (req: Request<{}, {}, {}>, res, next) => {

    // header überprüfen
    //ip chechen

    voteHandler.saveVote()

    res.json({message: "du bist dumm"});
}