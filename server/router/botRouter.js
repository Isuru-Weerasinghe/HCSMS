import express from "express";
import BotResponse from "../model/botResponse.js";

const botRouter = express.Router();

const getResponse = async (query) => {
  try {
    const botResponses = await BotResponse.find({
      "question.query": { $regex: `^${query}$`, $options: "i" }
    });

    if (botResponses.length > 0) {
      for (const response of botResponses) {
        const responseList = await response.question.response;
        const randomIndex = Math.floor(Math.random() * responseList.length);
        const selectedResponse = responseList[randomIndex]; // Use a descriptive variable name

        // Now you can use the 'selectedResponse' variable
        return { status: "found", response: selectedResponse };
      }
    } else {
      return { status: "not found", response: "" };
    }
  } catch (e) {
    return { status: "error", response: "" };
  }
};

botRouter.post("/", async (req, res) => {
    const question = req.body;
    const response = await getResponse(question.query);
    res.status(200).json({response : response, query : question.query});
})

export default botRouter;