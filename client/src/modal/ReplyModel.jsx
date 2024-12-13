import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    Input,
  } from "@nextui-org/react";
import { useState } from "react";

const ReplyModal = ({
        isReplyModalOpen,
        closeReplyModal,
        selectedMessage,
        nextClinicDate,
        setNextClinicDate,
        handleReplySubmit,

    }
) => {
    const [replyMessage, setReplyMessage] = useState("");
    return (
        <Modal isOpen={isReplyModalOpen} onClose={closeReplyModal}>
        <ModalContent>
          <ModalHeader>Reply to {selectedMessage?.name}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="replyMessage" className="font-semibold">
                  Message:
                </label>
                <Input
                  type="text"
                  id="replyMessage"
                  placeholder="Enter your message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  fullWidth
                />
              </div> 
              {selectedMessage?.name != "Admin" ? (
                <div>
                <label htmlFor="nextClinicDate" className="font-semibold">
                  Next Clinic Date:
                </label>
                <Input
                  type="date"
                  id="nextClinicDate"
                  value={nextClinicDate}
                  onChange={(e) => setNextClinicDate(e.target.value)}
                  fullWidth
                />
              </div>
              ) : null}
              
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={ () => {
              if (replyMessage.trim() != "") {handleReplySubmit(selectedMessage, replyMessage);}
              }}> 
              
              Submit
            </Button>
            <Button color="secondary" onPress={closeReplyModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}


export default ReplyModal;