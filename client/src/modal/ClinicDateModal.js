import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  DatePicker,
} from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const ClinicDateModal = ({ isOpen, onOpenChange, datac, docName, docId}) => {
  const [date, setDate] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate patient ID
    if (!datac?._id) {
      toast.error("Patient ID is required, please scan the QR code");
      return;
    }

    // Validate clinic date
    if (!date) {
      toast.error("Clinic Date is required");
      return;
    }

    // Format date properly (ISO string)
    const formattedDate = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

    const nextClinicdate = {
      patientId: datac._id,
      date: new Date(formattedDate), // Ensure this is a Date object
      dateIssuedBy: docName,
      doctorId : docId,
    };
    console.log("docId  asdfasdfasdf : ",  )
    try {
      const res = await axios.post("http://localhost:5000/medical-record/nextDate", nextClinicdate);

      if (res.status === 201) {
        toast.success("Clinic Date Added Successfully");
        onOpenChange();
      }
    } catch (error) {
      // Check if the error response is for a past date
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message || "Failed to add Clinic Date";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  // Define a minDate to prevent past date selection
  const minDate = new Date(); // Prevents user from selecting past dates

  return (
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
            <ModalHeader className="flex flex-col gap-1">Clinic Date</ModalHeader>
            <form onSubmit={onSubmit}>
              <ModalBody>
                <div className="flex gap-5">
                  <DatePicker
                    autoFocus
                    label="Clinic Date"
                    variant="bordered"
                    isRequired
                    showMonthAndYearPickers
                    minDate={minDate} // Prevent past date selection
                    onChange={(selectedDate) => setDate(selectedDate)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={() => setDate(null)}>
                  Clear
                </Button>
                <Button color="primary" type="submit">
                  Add Clinic Date
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ClinicDateModal;
