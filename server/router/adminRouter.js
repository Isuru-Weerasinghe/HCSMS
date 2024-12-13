import express from "express";
import {
  searchUser,
} from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/search/:idNumber", searchUser);

export default adminRouter;
