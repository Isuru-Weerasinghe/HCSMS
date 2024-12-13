import mongoose from "mongoose";

const BotResponseSchema = mongoose.Schema({
    name : String,
    question : {
        query : [String],
        response : [String]
    }
})

const BotResponse = mongoose.model("BotResponse", BotResponseSchema);
export default BotResponse;