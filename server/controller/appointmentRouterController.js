import appointmentRequest from "../model/appointmentRequests.js"
import Patients from "../model/Patients.js";

export const getAppointmentRequestsDoc = async (req, res) => {
    const docId = req.params.id;
    const findResult = await appointmentRequest.find({
        docId:docId,
        type : "request"
    })
    res.status(200).json({requests:findResult})
}

export const getAppointmentRequestsPat = async (req, res) => {
    const patientUserEmail = req.params.id;
    const patientFind = await Patients.find({
        email : patientUserEmail
    })
    const patientId = patientFind[0]._id.toString()
    const findResult = await appointmentRequest.find({
        patientId : patientId,
        type : "reply"
    })
    res.status(200).json({replies :findResult})
}

export const putAppointmentRequest = async (req, res) => {
    //create new appointment request
    const data = req.body
    let type = req.body?.type
    if (type === undefined){type="request"}
    
    try {
        const response = await appointmentRequest.create({
            type: type,
            patientId : data.patientId,
            docId : data.doctorId,
            reason : data.reason
        })
        res.status(201).json({message:"Appointment Request Created"})
    }catch (e) { res.send({message: e.message })}
}


export const deleteAppointmentRequest = async (req, res) => {
    const messageId = req.params?.id;
    if (!messageId) {
        return res.status(400).json({ message: "ID is not provided" });
    }
    try {
        const deletedRequest = await appointmentRequest.findByIdAndDelete(messageId);
        if (!deletedRequest) {
            return res.status(404).json({ message: "Appointment request not found" });
        }

        res.status(200).json({ message: "Appointment request deleted successfully" });
    } catch (error) {
        console.error("Error deleting appointment request:", error);
        res.status(500).json({ message: "Error deleting appointment request", error: error.message });
    }
};
