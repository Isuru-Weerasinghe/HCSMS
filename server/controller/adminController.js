import Patients from "../model/Patients.js";
import User from "../model/User.js";


export const searchUser = async (req, res) => {
    const { idNumber } = req.params;
  
    try {
      // Search for patient by idNumber
      const patient = await Patients.findOne({ idNumber });
      if (patient) {
        return res.status(200).json({
          type: "patient",
          data: {
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phoneNumber: patient.phoneNumber,
            address: patient.address,
          },
        });
      }
  
      // Search for staff by idNumber
      const staff = await User.findOne({ idNumber });
      if (staff) {
        return res.status(200).json({
          type: "staff",
          data: {
            username: staff.username,
            email: staff.email,
            phoneNumber: staff.phoneNumber,
            address: staff.address,
            role: staff.role,
          },
        });
      }
  
      // If no patient or staff is found
      res.status(404).json({ message: "No user found with this ID number" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
