import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import axios from "axios";
import { useGlobalRefetch } from "../store/store";

const DeletePharmacyModel = ({
  isOpen,
  onOpenChange,
  selectedPharmacyId,
  setSelectedPharmacyId,
  setRefetch,
}) => {
  const { setGlobalRefetch } = useGlobalRefetch();

  const deleteDoctor = () => {
    if (selectedPharmacyId) {
      try {
        axios.delete(`http://localhost:5000/auth/${selectedPharmacyId}`);
        setSelectedPharmacyId(null);
        // setRefetch((prev) => !prev);
        setGlobalRefetch(true);
      } catch (error) {
        console.log(error);
      }
    }
    onOpenChange();
  };

  console.log(selectedPharmacyId);

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
              Delete Doctor
            </ModalHeader>
            <ModalBody>
              <div>
                if you delete this doctor, all the information will be lost
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                disabled={!selectedPharmacyId}
                color="danger"
                variant="solid"
                onClick={deleteDoctor}
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
export default DeletePharmacyModel;
