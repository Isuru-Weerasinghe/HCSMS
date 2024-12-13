import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const NewBloodReportModal = ({ isOpen, onOpenChange, datac, docName,onAddLab }) => {
  const [bloodReport, setBloodReport] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirm modal

  const handleBloodReportChange = (e) => {
    setBloodReport(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!bloodReport) {
      return toast.error("Report request is required");
    }
    setIsConfirmModalOpen(true); // Open confirm modal before submission
  };

  const handleSubmit = async () => {
    if (!datac?._id) {
      setIsConfirmModalOpen(false);
      return toast.error("Patient ID is required, please scan the QR code");
    }

    const bloodReportRequest = {
      patientId: datac?._id,
      report_desc: bloodReport,
      reportRequested: docName,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/medical-record/lab",
        bloodReportRequest
      );
      if (res.status === 200) {
        toast.success("Report Request is Added Successfully");
        onOpenChange(); // Close the modal after success
        setBloodReport(""); // Clear the form after submission
        setIsConfirmModalOpen(false); // Close the confirmation modal
        onAddLab();
      }
    } catch (error) {
      toast.error("Failed to add report request");
      console.error(error);
    }
  };

  const handleConfirmSubmit = () => {
    handleSubmit();
  };

  const handleClear = () => {
    setBloodReport(""); // Clear form on clicking 'Clear' button
  };

  return (
    <>
      {/* Main Blood Report Modal */}
      <Modal
        size="lg"
        placement="top-center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Request Lab Report
              </ModalHeader>
              <form onSubmit={handleFormSubmit}>
                <ModalBody>
                  <div className="flex gap-5">
                    <Textarea
                      autoFocus
                      label="Lab Test Request"
                      placeholder="Enter test description"
                      onChange={handleBloodReportChange}
                      value={bloodReport} // Bind the value to input
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button color="primary" type="submit">
                    Add Test Request
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>Confirm Test Request</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to submit this lab test request?</p>
            <ul>
              <li>{bloodReport}</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleConfirmSubmit}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewBloodReportModal;
