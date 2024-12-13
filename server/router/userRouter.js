import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  userLogin,
  userRegister,
  getUserCount,
  getRoleUsers,
} from "../controller/userController.js";
import { staffRegister } from "../controller/staffController.js";

const userRouter = express.Router();

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.post("/staff", staffRegister);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/count", getUserCount);
userRouter.get("/getroleusers/:role", getRoleUsers);

export default userRouter;
