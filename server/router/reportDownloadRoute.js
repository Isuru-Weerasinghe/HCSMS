import express from "express";
import { dayReportDownloader , fullReportDownloader } from "../controller/reportDownloadController.js";

const reportDownloadRouter = express.Router();

reportDownloadRouter.post('/day', dayReportDownloader);
reportDownloadRouter.post('/full', fullReportDownloader);

export default reportDownloadRouter;