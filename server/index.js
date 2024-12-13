import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectMongoDB from "./db/connectMongoDB.js";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import patientRouter from "./router/patientRouter.js";
import medicalRouter from "./router/medicalRouter.js";
import reportsRouter from "./router/reportsRouter.js";
import adminRouter from "./router/adminRouter.js"

import botRouter from "./router/botRouter.js";
import appointmentRequestRouter from "./router/appointmentRouter.js"
import reportDownloadRouter from "./router/reportDownloadRoute.js";
import adminMessageRouter from "./router/adminMessageRouter.js";

import feedbackRouter from  "./router/feedbackRouter.js";
import { sendUsernamePassword } from "./utils/SendSMS.js";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";
import Feedback from "./model/feedback.js";
import User from "./model/User.js";
import { fileURLToPath } from "url"; // New addition to fix __dirname

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;
dotenv.config();

// Set up multer to store files locally
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Fix for static uploads path

app.use("/auth", userRouter);
app.use("/patients", patientRouter);
app.use("/medical-record", medicalRouter);
app.use("/reports", reportsRouter);
app.use("/admin", adminRouter);
app.use("/feedbacks", feedbackRouter);

app.use("/report", reportDownloadRouter);
app.use("/appointment", appointmentRequestRouter);
app.use("/adminmessage", adminMessageRouter);
app.use("/bot", botRouter);

connectMongoDB();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "isurusajith68@gmail.com",
    pass: "nszv pknm htuv lqzw",
  },
});

app.post("/send-email", upload.single("attachment"), (req, res) => {
  const { to, subject, text } = req.body;
  const attachment = req.file;

  const mailOptions = {
    from: "entunit@kolonnBaseHospital.com",
    to,
    subject,
    text,
    attachments: [
      {
        filename: attachment.originalname,
        content: attachment.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.post("/feedback", async (req, res) => {
  const { email, feedback, id } = req.body;
  console.log(email);

  try {
    const user = await User.findById(id);

    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const data = await Feedback.create({
        email,
        feedback,
        username: user.username,
        image: "https://avatar.iran.liara.run/public",
      });

      res.status(201).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

app.get("/feedback", async (req, res) => {
  try {
    const data = await Feedback.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`app listening on port ${port}!`));
