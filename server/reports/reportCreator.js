import PDFDocument from "pdfkit";
import fs from 'fs';
import path from 'path';

const writeFileAsync = (doc, outputPath) => {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(outputPath);
        doc.pipe(writeStream);
        doc.end();
        writeStream.on('finish', () => resolve(outputPath)); 
        writeStream.on('error', reject); 
    });
};

export const createDayReport = async (params) => {
    console.log("Creating Report")
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const { details, report } = params;

    const moveDown = (lines = 1) => doc.moveDown(lines);

    doc.fontSize(30).text("Kolonna Base Hospital", { align: 'center' });
    moveDown();
    doc.fontSize(25).font('Times-Bold').text("ENT Unit", { align: 'center' });
    moveDown(2);
    doc.fontSize(20).font('Times-Roman').text("Patient Medical e-Book", { align: 'center' });
    moveDown(5);

    const bottomMargin = 50;
    const pageHeight = doc.page.height;

    doc.fontSize(15);
    doc.text(`Name: ${details.name}`, 50, pageHeight - bottomMargin - 80);
    doc.text(`ID Number: ${details.idNo}`, 50, pageHeight - bottomMargin - 60);
    doc.text(`Phone Number: ${details.phoneNo}`, 50, pageHeight - bottomMargin - 40);
    doc.text(`Email: ${details.email}`, 50, pageHeight - bottomMargin - 20);

    doc.addPage();

    const dateObject = new Date(report.date);
    const date = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;

    doc.fontSize(15).text(`Date: ${date}`);
    moveDown(0.5);
    doc.text(`Diagnosis done by: ${report.doctor}`);
    moveDown(2);

    doc.fontSize(13).font('Times-Bold').text("Medical Diagnosis:");
    moveDown(0.5);
    doc.font('Times-Roman');
    report.medicalDiag.forEach(diag => doc.text(`- ${diag}`, { indent: 20 }));
    moveDown(2);

    doc.fontSize(13).font('Times-Bold').text("Prescriptions Issued:");
    moveDown(0.5);
    doc.font('Times-Roman');
    report.medicines.forEach(medicine => doc.text(`- ${medicine}`, { indent: 20 }));
    moveDown(2);

    doc.fontSize(13).font('Times-Bold').text("X-Ray Requests:");
    moveDown(0.5);
    doc.font('Times-Roman');
    report.xray.forEach(xray => doc.text(`- ${xray}`, { indent: 20 }));
    moveDown(2);

    doc.fontSize(13).font('Times-Bold').text("Lab Tests Issued:");
    moveDown(0.5);
    doc.font('Times-Roman');
    report.labTests.forEach(test => doc.text(`- ${test}`, { indent: 20 }));
    moveDown(2);

    const saveFolder = './reports';
    const outputPath = path.join(saveFolder, `Day Report ${details.idNo}.pdf`);

    await writeFileAsync(doc, outputPath);

    return outputPath;
};

export const createFullReport = async (params) => {
    console.log("Creating Report")
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const { details, reports } = params;

    const moveDown = (lines = 1) => doc.moveDown(lines);

    doc.fontSize(30).text("Kolonna Base Hospital", { align: 'center' });
    moveDown();
    doc.fontSize(25).font('Times-Bold').text("ENT Unit", { align: 'center' });
    moveDown(2);
    doc.fontSize(20).font('Times-Roman').text("Patient Medical e-Book", { align: 'center' });
    moveDown(5);

    const bottomMargin = 50;
    const pageHeight = doc.page.height;

    doc.fontSize(15);
    doc.text(`Name: ${details.name}`, 50, pageHeight - bottomMargin - 80);
    doc.text(`ID Number: ${details.idNo}`, 50, pageHeight - bottomMargin - 60);
    doc.text(`Phone Number: ${details.phoneNo}`, 50, pageHeight - bottomMargin - 40);
    doc.text(`Email: ${details.email}`, 50, pageHeight - bottomMargin - 20);

    reports.forEach((report) => {
        doc.addPage();

        const dateObject = new Date(report.date);
        const date = `${dateObject.getFullYear()}-${dateObject.getMonth() + 1}-${dateObject.getDate()}`;

        doc.fontSize(15).text(`Date: ${date}`);
        moveDown(0.5);
        doc.text(`Diagnosis done by: ${report.doctor}`);
        moveDown(2);

        doc.fontSize(13).font('Times-Bold').text("Medical Diagnosis:");
        moveDown(0.5);
        doc.font('Times-Roman');
        report.medicalDiag.forEach(diag => doc.text(`- ${diag}`, { indent: 20 }));
        moveDown(2);

        doc.fontSize(13).font('Times-Bold').text("Prescriptions Issued:");
        moveDown(0.5);
        doc.font('Times-Roman');
        report.medicines.forEach(medicine => doc.text(`- ${medicine}`, { indent: 20 }));
        moveDown(2);

        doc.fontSize(13).font('Times-Bold').text("X-Ray Requests:");
        moveDown(0.5);
        doc.font('Times-Roman');
        report.xray.forEach(xray => doc.text(`- ${xray}`, { indent: 20 }));
        moveDown(2);

        doc.fontSize(13).font('Times-Bold').text("Lab Tests Issued:");
        moveDown(0.5);
        doc.font('Times-Roman');
        report.labTests.forEach(test => doc.text(`- ${test}`, { indent: 20 }));
        moveDown(2);
    });

    const saveFolder = './reports';
    const outputPath = path.join(saveFolder, `Full Report ${details.idNo}.pdf`);

    await writeFileAsync(doc, outputPath);

    return outputPath;
};
