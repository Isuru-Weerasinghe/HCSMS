import Feedback from "../model/feedback.js";

// View feedback by email or by feedback ID
export const viewFeedback = async (req, res) => {
    console.log("inside feedback");
    
  try {
    const { email, id } = req.params;

    if (email) {
      const feedbacks = await Feedback.find({ email });
      if (feedbacks.length === 0) {
        // return res.status(404).json({ message: "No feedbacks found for this email" });
      }
      res.status(200).json(feedbacks);
    } else if (id) {
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.status(200).json(feedback);
    } else {
      res.status(400).json({ message: "Invalid request. Email or feedback ID is required" });
    }
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update feedback by feedback ID
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    // Find feedback by ID and update
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { feedback }, // Update only the feedback field
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback updated successfully", updatedFeedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete feedback by feedback ID
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};
