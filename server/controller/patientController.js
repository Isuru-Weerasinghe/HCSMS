import Patients from "../model/Patients.js";
import User from "../model/User.js";
import { sendUsernamePassword } from "../utils/SendSMS.js";

export const getPatients = async (req, res) => {
  try {
    const patients = await Patients.find();

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patients.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const createPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      idNumber,
      phoneNumber,
      email,
      dob,
      bloodGroup,
      address,
    } = req.body;

    const existing = await User.findOne({
      email,
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const patient = await Patients.create({
        firstName,
        lastName,
        idNumber,
        phoneNumber,
        email,
        dob,
        bloodGroup,
        address,
      });
      sendUsernamePassword(firstName, lastName, phoneNumber, email);

      res.status(201).json({ patient });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  
  try {
    const { id } = req.params;

    const patient = await Patients.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }


    if (patient) {
      patient.firstName = req.body.firstName;
      patient.lastName = req.body.lastName;
      patient.idNumber = req.body.idNumber;
      patient.phoneNumber = req.body.phoneNumber;
      patient.email = req.body.email;
      patient.dob = req.body.dob;
      patient.bloodGroup = req.body.bloodGroup;
      patient.address = req.body.address;
    }

    const updatedPatient = await patient.save();

    res.status(200).json({ patient: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patients.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    

    await patient.deleteOne({ _id: id });

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendEmail = async (req, res) => {};

export const getPatientByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    //search for email on patients list
    const patientFind = await Patients.find( {email : email})
    if (patientFind) {
      console.log("Patient Found");
      const patientId = patientFind[0]._id.toString();
      console.log(patientId);
      res.status(200).json({patientId : patientId  , message: "patient found"});
    }
    else {
      res.status(200).json({message:"not found"});
    }
    
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
}