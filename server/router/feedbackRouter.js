import express from "express";
import { viewFeedback, updateFeedback, deleteFeedback } from "../controller/feedbackController.js";

const feedbackRouter = express.Router();

// Route to view feedback by email or by feedback ID
feedbackRouter.get("/:email", viewFeedback); // View all feedbacks by user email
feedbackRouter.get("/view/:id", viewFeedback); // View feedback by feedback ID

// Route to update feedback by feedback ID
feedbackRouter.put("/update/:id", updateFeedback);

// Route to delete feedback by feedback ID
feedbackRouter.delete("/delete/:id", deleteFeedback);

export default feedbackRouter;
