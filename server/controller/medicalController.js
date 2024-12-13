import Lab from "../model/laboratary.js";
import Appointment from "../model/appointment.js";
import Medical from "../model/medical.js";
import MedicalRecord from "../model/medicalRecord.js";
import Queue from "../model/queue.js";
import Patient from "../model/Patients.js"
import Xray from "../model/xray.js";
import XrayQueue from "../model/xrayQueue.js";
import PrescriptionList from "../model/prescriptionList.js";
import { xRayDeliveredSms } from "../utils/SendSMS.js";

export const getMedicalHistory = async (req, res) => {
  try {
    const medicalRecords = await MedicalRecord.find();
    res.status(200).json(medicalRecords);
    
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// Get medical records for a specific patient by patientId
export const getPatientHistory = async (req, res) => {
  const { patientid } = req.params; 

  try {
    const medicalRecords = await MedicalRecord.find({ patientId: patientid });

    if (medicalRecords.length === 0) {
      return res.status(404).json({ message: "No medical records found for this patient" });
    }

    res.status(200).json(medicalRecords);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//add a new medical record

export const createMedicalRecord = async (req, res) => {
  const { patientId, docName, description } = req.body;
  if (!patientId) {
    
    return res.status(400).json({ message: "Please Scan patient's QR" });
    
  }

  if (!docName) {
    
    return res.status(400).json({ message: "Doctor name is required" });
  }

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  try {
    const newMedicalRecord = new MedicalRecord({
      patientId,
      docName,
      description,
      date: Date.now(), 
    });

    await newMedicalRecord.save();

    return res.status(201).json({
      data: newMedicalRecord,
      message: "Medical record added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update a medical record

export const updateMedicalRecord = async (req, res) => {
  
  const recordId = req.params.id; 
  const { description } = req.body;

  try {
    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      recordId,              
      { description },         
      { new: true }            
    );

    // If the record is not found, send a 404 response
    if (!updatedRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//delete a medical record

export const deleteMedicalRecord = async (req, res) => {
  
  try {
      const recordId = req.params.id;

      const deletedRecord = await MedicalRecord.findByIdAndDelete(recordId);

      if (!deletedRecord) {
          return res.status(404).json({ message: 'Medical record not found' });
      }

      res.status(200).json({ message: 'Medical record deleted successfully' });
  } catch (error) {
      console.error('Error deleting medical record:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

//create a prescriptionList

export const createPrescriptionList = async (req, res) => {
  const { patientId, docName, prescription_list } = req.body;

  
  if (!patientId) {
    return res.status(400).json({ message: "Please Scan patient's QR" });
  }

  if (!docName) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }

  if (!prescription_list) {
    console.log("err3");
    return res.status(400).json({ message: "Prescription list cannot be empty"});
  }

  try {
    
    const newPrescriptionRecord = new PrescriptionList({
      patientId: patientId,
      docName: docName,
      prescription:prescription_list, 
      date: Date.now(), 
    });

    await newPrescriptionRecord.save();
    return res.status(201).json({
      data: newPrescriptionRecord,
      message: "Prescription list added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get prescription by id

export const getPrescriptionByPatientId = async (req, res) => {
  const { patientid } = req.params;

  try {
    const prescription = await PrescriptionList.findOne({ patientId: patientid })
      .sort({ date: -1 })  
      .select('docName date prescription'); 

   
    if (!prescription) {
      return res.status(404).json({ message: "Prescription list not found" });
    }

    
    res.json({
      docName: prescription.docName,
      date: prescription.date,
      prescription: prescription.prescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create a xray request

export const createMedicalXray = async (req, res) => {
  const { patientId, xray, xrayIssued, delivered } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Please Scan patient's QR" });
  }

  if (!xray) {
    return res.status(400).json({ message: "X-ray details are required" });
  }

  if (!xrayIssued) {
    return res.status(400).json({ message: "Xray Issued by unknown!" });
  }
  try {
    const existMedical = await Xray.findOne({ patientId });

    const addXray = await Xray.create({
      patientId,
      xray,
      xrayIssued,
    });
    res.json(addXray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//read medical xray by id

export const getMedicalXray = async (req, res) => {
  const { patientid } = req.params;
  console.log(patientid);
  try {
    const xrayData = await Xray.find({ patientId: patientid });

    if (!xrayData) {
      return res.status(404).json({ message: "Xray not found" });
    }

    res.json(xrayData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//update medical xray

export const updateMedicalXray = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;
  console.log(id, firstName, lastName, phoneNumber);
  try {
    const xrayData = await Xray.findOne({ _id: id });

    if (!xrayData) {
      return res.status(404).json({ message: "Xray not found" });
    }

    const updatedXray = await Xray.findOneAndUpdate(
      xrayData._id,
      { delivered: true },
      {
        new: true,
      }
    );
    xRayDeliveredSms(firstName, lastName, phoneNumber);
    res.json(updatedXray);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




//create a lab request

export const createLabReport = async (req, res) => {
  const { patientId, report_desc, reportRequested, delivered } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }

  if (!report_desc) {
    return res.status(400).json({ message: "report description is required" });
  }

  if (!reportRequested) {
    return res.status(400).json({ message: "request Issued by unknown !" });
  }
  try {
    const existMedical = await Lab.findOne({ patientId });

    const addBloodReport = await Lab.create({
      patientId,
      report_desc,
      reportRequested,
    });
    res.json(addBloodReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get lab report by id

export const getLabReport = async (req, res) => {
  const { patientid } = req.params;
  console.log(patientid);
  try {
    const labData = await Lab.find({ patientId: patientid });

    if (!labData) {
      return res.status(404).json({ message: "Lab report not found" });
    }

    res.json(labData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//update lab request

export const updateLabReport = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber, pdfUrl } = req.body;
  console.log(id, firstName, lastName, phoneNumber, pdfUrl);
  try {
    const labData = await Lab.findOne({ _id: id });

    if (!labData) {
      return res.status(404).json({ message: "Lab report not found" });
    }

    const updatedLab = await Lab.findOneAndUpdate(
      labData._id,
      { delivered: true, pdfUrl },

      {
        new: true,
      }
    );
    res.json(updatedLab);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//set next clinic date

export const nextClinicDate = async (req, res) => {
  const { patientId, dateIssuedBy, date , doctorId} = req.body;

  
  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }

  if (!dateIssuedBy) {
    return res.status(400).json({ message: "Date issued by (Doctor's ID) is required" });
  }

  if (!date) {
    return res.status(400).json({ message: "Next clinic date is required" });
  }
  if (!doctorId) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }
  try {

    const clinicDate = new Date(date);
    const today = new Date();

    if (clinicDate < today) {
      return res.status(400).json({ message: "invalid date" });
    }

   
    const newAppointment = new Appointment({
      patientId,
      dateIssuedBy,
      date: new Date(date),
      doctorId: doctorId,
    });

    await newAppointment.save();

    return res.status(201).json({
      message: "Next clinic date set successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//add patient to the queue

export const addQueue = async (req, res) => {
  const { id } = req.params;

  try {
    let queue = await Queue.findOne();

    if (queue) {
      
      if (queue.queue.some((patient) => patient.item.toString() === id)) {
        return res.json({
          message: "Patient already in queue",
          queue,
        });
      } else {
        queue.queue.push({ item: id, createdAt: new Date() });
        await queue.save();
        return res.json({
          message: "Patient added to queue",
          queue,
        });
      }
    } else {
      // Create new queue if it doesn't exist
      queue = new Queue({
        queue: [{ item: id, createdAt: new Date() }],
      });
      await queue.save();
      return res.json({
        message: "Queue created and patient added",
        queue,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};



//remove from the queue

export const removeQueue = async (req, res) => {
  const { id } = req.params;
  try {
    let queue = await Queue.findOne();

    if (queue) {
      const patientIndex = queue.queue.findIndex((patient) => patient.item.toString() === id);
      
      if (patientIndex !== -1) {
        queue.queue.splice(patientIndex, 1);
        await queue.save();

        return res.json({
          message: "Patient removed from queue",
          queue,
        });
      } else {
        return res.json({
          message: "Patient not found in queue",
          queue,
        });
      }
    } else {
      return res.status(404).json({ message: "No queue found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


//get details from the queue

export const getQueue = async (req, res) => {
  console.log("inside get queue");
  
  try {
    const queue = await Queue.findOne().populate("queue.item"); 
    queue.queue.forEach((qItem) => {
      const item = qItem.item; 
      console.log("Patient Name:", item.firstName, item.lastName);
      console.log("Patient ID:", item.idNumber);
      console.log("Phone Number:", item.phoneNumber);
      console.log("Added At:", qItem.createdAt);
    });
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    res.status(200).json(queue);
  } catch (error) {
    console.error("Error fetching queue:", error);
    res.status(500).json({ message: error.message });
  }
};

//get prescription history of a patient

export const getPrescriptionHistoryByPatientId = async (req, res) => {
  const { patientid } = req.params; 
  try {
    const prescriptions = await PrescriptionList.find({ patientId:patientid});
    
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
};


//get the relevant patient xray history

export const getXrayHistoryByPatientId = async (req, res) => {
  const { patientId } = req.params;
  const { date } = req.query;
  console.log("xray called");

  try {
    const xray = await Xray.findOne({ patientId, date });
    res.status(200).json(xray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLabHistoryByPatientId= async (req, res) => {
  const { patientId } = req.params;
  const { date } = req.query;
  console.log("lab called");
  try {
    const lab = await Lab.findOne({ patientId, date });
    res.status(200).json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get today prescriptions count

export const getTodayPrescriptionCount = async (req, res) => {
  
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); 

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); 

    
    const prescriptionCount = await PrescriptionList.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({
      count: prescriptionCount,
    });
  } catch (error) {
    console.error("Error fetching today's prescriptions:", error);
    res.status(500).json({ message: "Failed to fetch today's prescriptions." });
  }
};

// get the count of total patients registered today

export const getTodayRegisteredCount = async (req, res) => {
  console.log("inside reg");
  
  try {
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); 
   
    const count = await Patient.countDocuments({
      registrationDate: { $gte: startOfDay, $lt: endOfDay },
    });

    console.log(count); 

    res.status(200).json({ count }); 
  } catch (error) {
    console.error("Error fetching registered patients:", error);
    res.status(500).json({ message: "Failed to fetch registered patients." });
  }
};

//update prescription list

export const updatePrescription = async (req, res) => {
  const prescriptionId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedPrescription = await PrescriptionList.findByIdAndUpdate(
      prescriptionId,
      updatedData,
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({
      message: "Prescription updated successfully",
      updatedPrescription,
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete selected prescription

export const deletePrescription = async (req, res) => {
  const prescriptionId = req.params.id;

  try {
    const deletedPrescription = await PrescriptionList.findByIdAndDelete(prescriptionId);

    if (!deletedPrescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({
      message: "Prescription deleted successfully",
      deletedPrescription,
    });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//get the appoinments according to date

export const getAppoinments = async (req, res) => {
  const { date } = req.query; 

  try {
    const appointments = await Appointment.find({ date })
      .populate("patientId"); 

    const patientDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await Patient.findById(appointment.patientId);
        return {
          name: `${patient.firstName} ${patient.lastName}`,
          idNumber: patient.idNumber,
          phoneNumber: patient.phoneNumber,
          email: patient.email,
        };
      })
    );

    res.status(200).json(patientDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

//add to x-ray queue

export const addToXrayQueue = async (req, res) => {
  const { patientId } = req.body;

  if (!patientId) {
    return res.status(400).json({ message: "Patient ID is required" });
  }

  try {
    const existingQueue = await XrayQueue.findOne({ patientId });
    if (existingQueue) {
      return res.status(400).json({ message: "Patient is already in the queue" });
    }

    // Create new XQueue entry
    const queueEntry = new XrayQueue({ patientId });
    await queueEntry.save();

    return res.status(200).json({ message: "Patient added to X-ray queue" });
  } catch (error) {
    console.error("Error adding to queue:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//get total x-ray queue count

export const getXqueueCount = async (req, res) => {
  
  try {
    const xrayQueueCount = await XrayQueue.countDocuments();
    res.status(200).json({ totalInQueue: xrayQueueCount });
  } catch (error) {
    console.error("Error fetching X-ray queue count:", error);
    res.status(500).json({ message: "Error fetching X-ray queue count" });
  }
};

//get patients data in the xray queue

export const getXqueueData = async (req, res) => {
  try {
    const queue = await XrayQueue.find()
      .sort({ createdAt: 1 }) 
      .populate("patientId", "firstName lastName idNumber phoneNumber email dob address");

    res.status(200).json({ queue });
  } catch (error) {
    console.error("Error fetching X-ray queue:", error);
    res.status(500).json({ message: "Server error while fetching X-ray queue" });
  }
};

//remove from the xray queue

export const removeXrayQueue = async (req, res) => {
  const patientId = req.params.patientId; 

  try {
    const result = await XrayQueue.findOneAndDelete({ patientId: patientId });
    if (!result) {
      return res.status(404).json({ message: 'Patient not found in the queue.' });
    }

    return res.status(200).json({ message: 'Patient removed from the X-ray queue successfully.' });
  } catch (error) {
    console.error("Error removing patient from queue:", error);
    return res.status(500).json({ message: 'An error occurred while removing the patient from the queue.' });
  }
};

// get the no of xray requests of the current date

export const countXQueueToday = async (req, res) => {
  console.log("inside count");
  
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); 

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); 

    // Count the documents created today
    const count = await Xray.countDocuments({
      createdAt: {
        $gte: startOfDay,  
        $lt: endOfDay     
      }
    });
    console.log(count);
    

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting XQueue documents:", error);
    res.status(500).json({ message: "Failed to count XQueue documents" });
  }
};

//get total lab report count
export const getTotalLabResults = async (req, res) => {
  
  try {
    const totalReports = await Lab.countDocuments({});
    res.status(200).json({ totalReports });
  } catch (error) {
    console.error("Error fetching lab reports total count:", error);
    res.status(500).json({ message: "Failed to get the total count of lab reports" });
  }
};

//get paitents next clinic date
export const getNextClinicDate = async (req, res) => {
  const patientId = req.params.id;
  const appointmentFind = await Appointment.find({patientId:patientId})
  //if no appointments for patient
  if (appointmentFind.length === 0) { 
    res.status(200).json({message:"no appointments"})
    return
  }
  console.log(appointmentFind)
  const appointment = appointmentFind[appointmentFind.length-1]
  res.status(200).json({message:"appointment", appointment: appointment})
}