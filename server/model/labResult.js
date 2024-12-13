import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients", // Reference to the Patients collection
    required: true,
  },
  testDescription: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true, // File path for the uploaded report
  },
  uploadedAt: {
    type: Date,
    default: Date.now, // Timestamp for when the report is uploaded
  },
  lab_delivered: {
    type: Boolean,
    default: false, // Indicates if the report has been delivered; initially set to false
  },
});

const LabResult = mongoose.model("LabResult", labResultSchema);

export default LabResult;
