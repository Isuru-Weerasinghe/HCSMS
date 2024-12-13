import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  feedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image : {
    type: String,
  }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
