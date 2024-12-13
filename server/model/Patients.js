import mongoose from "mongoose";

const PatientsSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  registrationDate: { 
    type: Date, default: Date.now 
  },
});

const Patients = mongoose.model("Patients", PatientsSchema);

export default Patients;
