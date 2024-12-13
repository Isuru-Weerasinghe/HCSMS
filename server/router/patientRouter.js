import express from "express";
import {
  createPatient,
  deletePatient,
  getPatientById,
  getPatients,
  sendEmail,
  updatePatient,
  getPatientByEmail
} from "../controller/patientController.js";

const patientRouter = express.Router();

patientRouter.get("/", getPatients);
patientRouter.get("/:id", getPatientById);
patientRouter.post("/", createPatient);
patientRouter.put("/:id", updatePatient);
patientRouter.delete("/:id", deletePatient);
patientRouter.post("/send-email", sendEmail);
patientRouter.get("/email2id/:email", getPatientByEmail);

export default patientRouter;
