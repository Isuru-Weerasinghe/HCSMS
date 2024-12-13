import mongoose from "mongoose";

const appointmentRequestSchema = mongoose.Schema({
    type : {type: String},
    patientId :{ type : String },
    docId : { type:String },
    reason: { type: String},
})

const appointmentRequest = mongoose.model("AppointmentRequests", appointmentRequestSchema);
export default appointmentRequest;