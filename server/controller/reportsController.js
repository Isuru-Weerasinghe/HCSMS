import Lab from "../model/laboratary.js";
import mongoose from "mongoose";
import path from "path";
import { labReportReadySms } from "../utils/SendSMS.js";

export const uploadLabResult = async (req, res) => {
    console.log("Inside file upload");
    const { firstName, lastName, phoneNumber } = req.body;
    const file = req.file;
    const { labId, delivered } = req.body;

    if (!file || !labId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        
        const existingLab = await Lab.findOne({ _id: new mongoose.Types.ObjectId(labId) });

        if (existingLab) {
            existingLab.pdfUrl = path.join("uploads", file.filename); 
            existingLab.delivered = delivered === 'true'; 
            existingLab.date = new Date();
            await existingLab.save();
            labReportReadySms(firstName, lastName, phoneNumber);

            res.status(200).json({
                message: "Lab result uploaded successfully",
                existingLab,
            });
        } 
    } catch (error) {
        console.error("Error uploading lab result:", error);
        res.status(500).json({ message: "Error uploading lab result" });
    }
};

export const getLabResultsByPatientId = async (req, res) => {
    const { patientId } = req.params;
    console.log("inside get lab results")
    try {
      const labResults = await Lab.find({ patientId: new mongoose.Types.ObjectId(patientId) }).sort({ date: -1 });
      if (!labResults.length) {
        return res.status(404).json({ message: "No lab results found for this patient" });
      }
  
      res.status(200).json(labResults);
    } catch (error) {
      console.error("Error fetching lab results:", error);
      res.status(500).json({ message: "Error fetching lab results" });
    }
  };
