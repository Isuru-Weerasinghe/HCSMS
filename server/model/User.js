import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],

  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  slmcNumber: {
    type: String,
  },
  dob: {
    type: String,
  },
  address: {
    type: String,
  },
  idNumber: {
    type: String,
  },
  role: {
    type: String,
    enum: [
      "registar",
      "admin",
      "doctor",
      "pharmacist",
      "laboratorist",
      "receptionist",
      "rediologist",
      "patient",
      "attendant",
    ],
    default: "patient",
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
