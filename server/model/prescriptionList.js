import mongoose from "mongoose";

const prescriptionListSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  docName: {
    type: String,
    required: true,
  },
  prescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const PrescriptionList = mongoose.model('PrescriptionList', prescriptionListSchema);

export default PrescriptionList;
