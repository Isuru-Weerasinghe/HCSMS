import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  docName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const MedicalRecord = mongoose.model("MedicalRecord", MedicalRecordSchema);

export default MedicalRecord;
