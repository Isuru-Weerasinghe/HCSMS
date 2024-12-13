import express from "express";
import { getAppointmentRequestsDoc, getAppointmentRequestsPat, putAppointmentRequest, deleteAppointmentRequest } from "../controller/appointmentRouterController.js";
const appointmentRequestRouter = express.Router();

appointmentRequestRouter.get("/request/:id", getAppointmentRequestsDoc);
appointmentRequestRouter.get("/reply/:id", getAppointmentRequestsPat);
appointmentRequestRouter.post("/", putAppointmentRequest);
appointmentRequestRouter.delete("/:id", deleteAppointmentRequest);

export default appointmentRequestRouter;