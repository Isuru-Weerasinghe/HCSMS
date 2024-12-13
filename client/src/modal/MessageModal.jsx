import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    CardBody,
    Card,
  } from "@nextui-org/react";

const MessageModal = ({
    isAMessageOpen,
    toggleAMessageModal,
    notificationSelectedMessage,
    role,
    openReplyModal,
    handleDeleteMessage,

    }
) => {
    return (
     <Modal isOpen={isAMessageOpen} onClose={toggleAMessageModal}>
        <ModalContent>
          <ModalHeader>Message</ModalHeader>
          <ModalBody>
            <Card style={{ backgroundColor: "#d4eeef" }}>
              <CardBody className="flex justify-between items-center">
                <div style={{display:"flex", flexDirection:"row"}}>
                  <div>
                    <h4 style={{ fontWeight: "bolder", textAlign: "center" }}>{notificationSelectedMessage.name}</h4>
                    <h3>{notificationSelectedMessage.message}</h3>
                  </div>
                  <div style={{paddingLeft:"40px"}}>
                    <div className="flex items-center">
                      {role === "doctor" ? (
                        <Button color="primary" onPress={() => openReplyModal(notificationSelectedMessage)}>
                          Reply
                        </Button>
                      ) : null}
                      <button
                        className="text-red-500 ml-4"
                        onClick={() => {toggleAMessageModal();handleDeleteMessage(notificationSelectedMessage.id, notificationSelectedMessage)}}
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={toggleAMessageModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}


export default MessageModal;