import mongoose from "mongoose";

const adminMesasgeSchema = new mongoose.Schema({
  type : {
    type: String
  },
  role: {
    type: String
  },
  
  userId: {
    type: String
  },
  username : {
    type: String
  },
  message : {
    type: String
  }
});

const adminMesasge = mongoose.model("adminMesasge", adminMesasgeSchema);
export default adminMesasge;