import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const ClickShowMoreAttendant = ({ isOpen, onOpenChange, attendant }) => {
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
              Doctor Information
            </ModalHeader>
            <ModalBody>
              <div className="flex  gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-5">
                    <span className="text-gray-900">Name</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900">ID Number</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900">Date of Birth</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900">Phone Number</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900">Email</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900">Address</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900">Role</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">{attendant.username}</span>
                  </div>
                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">{attendant.idNumber}</span>
                  </div>

                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">{attendant.dob}</span>
                  </div>
                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">
                      {attendant.phoneNumber}
                    </span>
                  </div>
                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">{attendant.email}</span>
                  </div>
                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">{attendant.address}</span>
                  </div>
                  <div className="flex  gap-1">
                    <span className="text-gray-500">:</span>
                    <span className="text-gray-500">{attendant.role}</span>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ClickShowMoreAttendant;
