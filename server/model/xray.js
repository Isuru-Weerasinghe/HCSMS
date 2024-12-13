import mongoose from "mongoose";

const XraySchema = new mongoose.Schema({
  patientId: {
    type: String,
  },
  xrayIssued: {
    type: String,
  },
  xray: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
});

const Xray = mongoose.model("Xray", XraySchema);
export default Xray;
