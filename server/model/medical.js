import mongoose from "mongoose";

const MedicalSchema = mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  medicalRecode: {
    type: Array,
  },
  prescription: {
    type: String,
  },
  xray: {
    type: Array,
  },
  xrayIssued: {
    type: Array,
  },
  bloodReport: {
    type: Array,
  },
  clinicalDate: {
    type: Array,
  },
  medicingDilivery: {
    type: Boolean,
    default: false,
  },
});

const Medical = mongoose.model("Medical", MedicalSchema);

export default Medical;
