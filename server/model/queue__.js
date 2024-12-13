import mongoose from "mongoose";

const QueueSchema = mongoose.Schema({
  queue: {
    type: Array,
    required: true,
  },
});

const Queue = mongoose.model("Queue", QueueSchema);

export default Queue;
