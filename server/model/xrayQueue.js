import mongoose from "mongoose";

const xQueueSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Patients",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const XQueue = mongoose.model("XQueue", xQueueSchema); 
export default XQueue;
