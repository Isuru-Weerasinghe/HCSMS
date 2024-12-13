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

const NotificationsModal = ({
    isNotificationOpen,
    toggleNotificationModal,
    toggleAMessageModal,
    messagesList,
    setNotificationSelectedMessage,
    }
) => {
    return (
        <Modal isOpen={isNotificationOpen} onClose={toggleNotificationModal}>
        <ModalContent>
            <ModalHeader>Notifications</ModalHeader>
            <ModalBody>
            <Card style={{ backgroundColor: "#d4eeef" }}>
                {messagesList.map((message, index) => (
                <CardBody key={index} className="flex justify-between items-center" onClick={() => { setNotificationSelectedMessage(message); toggleAMessageModal(); }}>
                    <div style={{ display: "flex", flexDirection: "row", backgroundColor: "#E7EDEB", width: "90%", borderRadius: "10px" }}>
                    <div style={{ padding: "8px", width: "100%" }}>
                        <h4 style={{ fontWeight: "bolder", textAlign: "center" }}>New message from</h4>
                        <h3>{message.name}</h3>
                    </div>
                    </div>
                </CardBody>
                ))}
            </Card>
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onPress={toggleNotificationModal}>
                Close
            </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    )
}


export default NotificationsModal;