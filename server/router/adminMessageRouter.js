import express from "express";
import { addMessage , getMessages, deleteMessage, getReplies} from "../controller/adminMessageController.js";



const adminMessageRouter = express.Router();

adminMessageRouter.post('/addmessage', addMessage); 
adminMessageRouter.get('/getmessages/:id', getMessages);
adminMessageRouter.delete('/deletemessage/:id', deleteMessage);
adminMessageRouter.get('/admingetreplies', getReplies)

export default adminMessageRouter;