import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Pagination,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Textarea,
} from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";

const MyFeedbacks = ({ myemail }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [selectedFeedback, setSelectedFeedback] = useState(null); // For viewing feedback
  const [editingFeedback, setEditingFeedback] = useState(null); // For editing feedback
  const [updatedFeedbackContent, setUpdatedFeedbackContent] = useState(""); // For storing the updated content
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility for viewing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal visibility for editing
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal visibility for confirmation
  const [feedbackToDelete, setFeedbackToDelete] = useState(null); // Feedback ID to delete

  const pages = Math.ceil(feedbacks.length / rowsPerPage);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/feedbacks/${myemail}`);
      const data = await response.json();
      if (response.ok) {
        setFeedbacks(data);
      } else {
        toast.error(data.message || "Failed to load feedbacks.");
      }
    } catch (error) {
      toast.error("Failed to load feedback.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleEdit = (feedback) => {
    setEditingFeedback(feedback); // Set the feedback to be edited
    setUpdatedFeedbackContent(feedback.feedback); // Pre-fill the modal with current feedback content
    setIsEditModalOpen(true); // Open the edit modal
  };

  const handleDeleteConfirmation = (id) => {
    setFeedbackToDelete(id); // Set the feedback ID to delete
    setIsConfirmModalOpen(true); // Open the confirmation modal
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/feedbacks/delete/${feedbackToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Feedback deleted successfully");
        fetchFeedbacks(); // Refresh feedbacks after deletion
        setIsConfirmModalOpen(false); // Close the confirmation modal
      } else {
        toast.error("Failed to delete feedback");
      }
    } catch (error) {
      toast.error("Error deleting feedback");
    }
  };

  const handleView = (feedback) => {
    setSelectedFeedback(feedback); // Set the selected feedback
    setIsModalOpen(true); // Open the view modal
  };

  const handleUpdateFeedback = async () => {
    try {
      const response = await fetch(`http://localhost:5000/feedbacks/update/${editingFeedback._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: updatedFeedbackContent }), // Send updated feedback content
      });

      if (response.ok) {
        toast.success("Feedback updated successfully");
        fetchFeedbacks(); // Refresh feedbacks after update
        setIsEditModalOpen(false); // Close the edit modal
      } else {
        toast.error("Failed to update feedback");
      }
    } catch (error) {
      toast.error("Error updating feedback");
    }
  };

  const paginatedItems = feedbacks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex flex-col items-center mt-10">
    <h2 className="text-2xl font-bold mb-4">My Feedbacks</h2>
      <Table
        aria-label="My Feedbacks"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              color="primary"
              page={page}
              total={pages}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>Date of Added</TableColumn>
          <TableColumn>Feedback</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((feedback) => (
            <TableRow key={feedback._id}>
              <TableCell>{new Date(feedback.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {feedback.feedback.length > 50
                  ? `${feedback.feedback.substring(0, 50)}...`
                  : feedback.feedback}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="View Feedback">
                    <Button
                      auto
                      color="primary"
                      size="sm"
                      onClick={() => handleView(feedback)}
                    >
                      <FaRegEye />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Edit Feedback">
                    <Button
                      auto
                      color="warning"
                      size="sm"
                      onClick={() => handleEdit(feedback)}
                    >
                      <FaUserEdit />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete Feedback">
                    <Button
                      auto
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteConfirmation(feedback._id)} 
                    >
                      <MdDeleteSweep />
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for viewing feedback */}
      {selectedFeedback && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          closeButton
        >
          <ModalContent>
            <ModalHeader>Feedback Details</ModalHeader>
            <ModalBody>
              <p><strong>Feedback:</strong> {selectedFeedback.feedback}</p>
            </ModalBody>
            <ModalFooter>
              <Button auto onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Modal for editing feedback */}
      {editingFeedback && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          closeButton
        >
          <ModalContent>
            <ModalHeader>Edit Feedback</ModalHeader>
            <ModalBody>
              <Textarea
                value={updatedFeedbackContent}
                onChange={(e) => setUpdatedFeedbackContent(e.target.value)}
                placeholder="Edit your feedback"
                minRows={4}
              />
            </ModalBody>
            <ModalFooter>
              <Button auto color="warning" onClick={handleUpdateFeedback}>
                Update Feedback
              </Button>
              <Button auto onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Confirmation Modal for deleting feedback */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        closeButton
      >
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this feedback?</p>
          </ModalBody>
          <ModalFooter>
            <Button auto color="error" onClick={handleDelete}>
              Yes, Delete
            </Button>
            <Button auto onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MyFeedbacks;
