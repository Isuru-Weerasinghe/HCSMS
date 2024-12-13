import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast"; // Import toast

const DeletePatientModel = ({
  isOpen,
  onOpenChange,
  selectedPatientId,
  setSelectedPatientId,
  setRefetch,
}) => {
  const deletePatient = () => {
    if (selectedPatientId) {
      try {
        axios.delete(`http://localhost:5000/patients/${selectedPatientId}`);
        toast.success("Patient deleted successfully!"); // Show success notification
        setSelectedPatientId(null);
        setRefetch(true);
      } catch (error) {
        toast.error("Failed to delete patient."); // Show error notification
        console.log(error);
      }
    }
    onOpenChange();
  };

  console.log(selectedPatientId);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Patient
            </ModalHeader>
            <ModalBody>
              <div>
                If you delete this patient, all the information will be lost.
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                disabled={!selectedPatientId}
                color="danger"
                variant="solid"
                onClick={deletePatient}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeletePatientModel;
