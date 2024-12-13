import {
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Confirm Action</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to add this X-ray request?</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const NewXrayModal = ({ isOpen, onOpenChange, datac, docName,onAddXray }) => {
  const [xray, setXray] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation modal

  const handleXrayChange = (e) => {
    setXray(e.target.value);
  };

  const handleSubmit = async () => {
    if (!datac?._id) {
      return toast.error("Patient ID is required, please scan the QR code");
    }

    if (!xray) {
      return toast.error("X-Ray is required");
    }

    const xrayIssued = docName;
    const xrayRequest = {
      patientId: datac?._id,
      xray: xray,
      xrayIssued,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/medical-record/xray",
        xrayRequest
      );
      if (res.status === 200) {
        toast.success("X-Ray Added Successfully");
        setXray(""); // Clear the form after submission
        onOpenChange(); // Close the X-ray modal
        onAddXray();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAddXrayClick = () => {
    setIsConfirmOpen(true); // Open the confirmation modal
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false); // Close the confirmation modal
    handleSubmit(); // Proceed with submitting the X-ray request
  };

  const handleClear = () => {
    setXray(""); // Clear the X-ray input field
  };

  return (
    <>
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
              <ModalHeader className="flex flex-col gap-1">New X-ray</ModalHeader>
              <form>
                <ModalBody>
                  <div className="flex gap-5">
                    <Textarea
                      autoFocus
                      label="X-Ray"
                      placeholder="Enter X-Ray"
                      value={xray}
                      onChange={handleXrayChange}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button
                    color="primary"
                    type="button"
                    onClick={handleAddXrayClick}
                    disabled={!xray} // Disable button if no input
                  >
                    Add X-Ray
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default NewXrayModal;
