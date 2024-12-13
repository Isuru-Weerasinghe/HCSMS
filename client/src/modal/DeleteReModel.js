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

const DeleteReModel = ({
  isOpen,
  onOpenChange,
  selectedRegistarId,
  setSelectedRegistarId,
  setRefetch,
}) => {
  const { setGlobalRefetch } = useGlobalRefetch();

  const deleteDoctor = () => {
    if (selectedRegistarId) {
      try {
        axios.delete(`http://localhost:5000/auth/${selectedRegistarId}`);
        setSelectedRegistarId(null);
        // setRefetch((prev) => !prev);
        setGlobalRefetch(true);
      } catch (error) {
        console.log(error);
      }
    }
    onOpenChange();
  };

  console.log(selectedRegistarId);

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
                disabled={!selectedRegistarId}
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
export default DeleteReModel;
