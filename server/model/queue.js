import mongoose from "mongoose";

const QueueItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QueueSchema = new mongoose.Schema({
  queue: {
    type: [QueueItemSchema], 
    required: true,
  },
});

const Queue = mongoose.model("Queue", QueueSchema);
export default Queue;
