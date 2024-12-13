import {
  Button,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

import toast from "react-hot-toast";

const FeedBackModal = ({ isOpen, onOpenChange, user }) => {
  const [feedBack, setFeedBack] = useState("");

  const handleFeedBack = async () => {
    try {
      const res = await axios.post("http://localhost:5000/feedback", {
        feedback: feedBack,
        email: user.email,
        id: user._id,
      });

      if (res.status === 201) {
        toast.success("FeedBack Added Successfully");
        onOpenChange();
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.message);
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

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
              Add Your FeedBack
            </ModalHeader>
            <ModalBody>
              <Textarea
                cols={20}
                onChange={(e) => setFeedBack(e.target.value)}
                placeholder="Enter your FeedBack"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="date"
                color="success"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  handleFeedBack();
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default FeedBackModal;
