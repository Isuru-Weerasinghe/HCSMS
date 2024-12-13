import {
  Button,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";

const RequestNewAppointment = ({patientId, doctorId, isOpen, onOpenChange }) => {
  const [reason, setReason] = useState("");
  
  const sendAppointmentRequest = () => {
    const payload = {
      patientId : patientId,
      doctorId : doctorId,
      reason : reason,
    }
    axios.post('http://localhost:5000/appointment', payload)
    .then( response => {
      console.log(response.data)
    })
  }

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
              Request New Appointment
            </ModalHeader>
            <ModalBody>
              <Input 
                rows={4}
                onChange={ (e) => setReason(e.target.value) }
              ></Input>
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
                  if (reason.trim() != "") {
                    sendAppointmentRequest();
                    onClose();
                  }
                }}
              >
                Request
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default RequestNewAppointment;
