import mongoose from "mongoose";

const labQueueSchema = new mongoose.Schema({
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

const labQueue = mongoose.model("labQueue", labQueueSchema); 
export default labQueue;
