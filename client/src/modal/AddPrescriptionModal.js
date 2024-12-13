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
          <p>Are you sure you want to add this prescription?</p>
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

const AddPrescriptionModal = ({ isOpen, onOpenChange, datac, docName,onAddPrescription }) => {
  const [prescription, setPrescription] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation modal

  const handlePrescriptionChange = (e) => {
    setPrescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!datac?._id) {
      return toast.error("Patient ID is required. Please scan the QR code.");
    }

    if (!prescription) {
      return toast.error("Prescription is required.");
    }

    const prescriptionList = {
      patientId: datac?._id,
      docName: docName,
      prescription_list: prescription,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/medical-record/prescriptionList",
        prescriptionList
      );
      if (res.status === 201) {
        toast.success("Prescription Added Successfully");
        onOpenChange(); // Close the Add Prescription Modal
        onAddPrescription();
      }
    } catch (error) {
      toast.error("Failed to add prescription", error);
    }
  };

  const handleAddPrescriptionClick = () => {
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false); // Close confirmation modal
    handleSubmit(); // Proceed with adding prescription
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
              <ModalHeader className="flex flex-col gap-1">
                Add Prescription
              </ModalHeader>
              <form>
                <ModalBody>
                  <div className="flex gap-5">
                    <Textarea
                      autoFocus
                      label="Add Medicines"
                      placeholder="Add medicines and after adding one, add ',' e.g., Aspirin, Paracetamol, Piriton"
                      onChange={handlePrescriptionChange}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onClick={() => setPrescription('')}>
                    Clear
                  </Button>
                  <Button color="primary" onClick={handleAddPrescriptionClick}>
                    Add Prescription
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default AddPrescriptionModal;
