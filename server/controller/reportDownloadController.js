import MedicalRecord from "../model/medicalRecord.js";
import Xray from "../model/xray.js";
import PrescriptionList from "../model/prescriptionList.js";
import Lab from "../model/laboratary.js";
import Patients from "../model/Patients.js";
import { createDayReport, createFullReport } from "../reports/reportCreator.js";
import fs from "fs";
import path from "path";  

const fetchDayData = async (date, patientId) => {
    const dateObject = new Date(date);
    const startDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), 0, 0, 0);
    const endDate = new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), 23, 59, 59);

    const medicalRecords = await MedicalRecord.find({ date: { $gte: startDate, $lte: endDate }, patientId });
    const xrayRecords = await Xray.find({ date: { $gte: startDate, $lte: endDate }, patientId });
    const prescriptions = await PrescriptionList.find({ date: { $gte: startDate, $lte: endDate }, patientId });
    const labs = await Lab.find({ date: { $gte: startDate, $lte: endDate }, patientId });

    const mediDiagsList = medicalRecords.map(record => record.description);
    const prescriptionsList = prescriptions.flatMap(record => record.prescription.split(',').map(p => p.trim()));
    const xrayList = xrayRecords.map(record => record.xray);
    const labList = labs.map(record => record.report_desc);

    return {
        date,
        doctor: medicalRecords[0]?.docName || "N/A",
        medicalDiag: mediDiagsList,
        medicines: prescriptionsList,
        xray: xrayList,
        labTests: labList
    };
};

export const dayReportDownloader = async (req, res) => {
    try {
        const { date, patientId } = req.body;

        const patientData = await Patients.findById(patientId);
        const details = {
            name: `${patientData.firstName} ${patientData.lastName}`,
            idNo: patientData.idNumber,
            phoneNo: patientData.phoneNumber,
            email: patientData.email
        };

        const report = await fetchDayData(date, patientId);
        const params = { details, report };

        const filePath = await createDayReport(params); // Ensure the path is awaited correctly

        if (filePath && typeof filePath === 'string') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
            res.download(filePath); // Send the file to download
        } else {
            res.status(500).json({ message: "Server Error: Could not generate report." });
        }
    } catch (error) {
        console.error("Error downloading day report:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


export const fullReportDownloader = async (req, res) => {
    try {
        const patientId = req.body.patientId;

        const allMedicalRecords = await MedicalRecord.find({ patientId });
        const patientData = await Patients.findById(patientId);

        const details = {
            name: `${patientData.firstName} ${patientData.lastName}`,
            idNo: patientData.idNumber,
            phoneNo: patientData.phoneNumber,
            email: patientData.email
        };

        const reportPromises = allMedicalRecords.map(record => fetchDayData(record.date, patientId));
        const reports = await Promise.all(reportPromises);

        const params = { details, reports };

        const filePath = await createFullReport(params); // Ensure the path is awaited correctly

        if (filePath && typeof filePath === 'string') {
            res.download(filePath); // Send the file to download
        } else {
            res.status(500).json({ message: "Server Error: Could not generate report." });
        }
    } catch (error) {
        console.error("Error downloading full report:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
