import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { bloodGroups } from "../data/bloodGroups";
import QrModal from "./QrModal";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  idNumber: yup
    .string()
    .required("ID number is required")
    .min(10, "ID number must be at least 10 characters")
    .max(12, "ID number must be at most 12 characters"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number must be at most 12 digits"),
  bloodGroup: yup.string().required("Blood group is required"),
  address: yup.string().required("Address is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  dob: yup.string().required("Date of birth is required"),
});

const AddPatientModel = ({ isOpen, onOpenChange, setRefetch }) => {
  const [qrId, setQrId] = useState("");
  const [patientsData, setPatientsData] = useState("");

  const {
    isOpen: isQrOpen,
    onOpen: openQr,
    onOpenChange: onQrChange,
  } = useDisclosure();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/patients", data);
      
      // Set the QR ID and patient data
      setQrId(res.data.patient._id);
      setPatientsData(res.data.patient);
      setRefetch(true);
      openQr();

      // Show success toast
      toast.success("Patient registered successfully!"); // Success toast
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.data.message); // Error toast
      } else {
        toast.error("An error occurred while registering the patient."); // General error toast
      }
    }
  };

  const clearFormValues = () => {
    reset();
  };

  return (
    <Modal
      size="5xl"
      placement="top-center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add Patient
            </ModalHeader>
            <form>
              <ModalBody>
                <div className="flex gap-5">
                  <Input
                    autoFocus
                    label="First Name"
                    placeholder="Enter first name"
                    variant="bordered"
                    {...register("firstName")}
                    errorMessage={errors.firstName?.message}
                    isInvalid={errors.firstName}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    variant="bordered"
                    errorMessage={errors.lastName?.message}
                    {...register("lastName")}
                    isInvalid={errors.lastName}
                  />
                </div>
                <div className="flex gap-5">
                  <Input
                    autoFocus
                    label="ID Number"
                    placeholder="Enter ID Number"
                    variant="bordered"
                    errorMessage={errors.idNumber?.message}
                    {...register("idNumber")}
                    isInvalid={errors.idNumber}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    variant="bordered"
                    errorMessage={errors.phoneNumber?.message}
                    {...register("phoneNumber")}
                    isInvalid={errors.phoneNumber}
                  />
                </div>
                <div className="flex gap-5">
                  <Input
                    autoFocus
                    label="Email"
                    placeholder="Enter Email Address"
                    variant="bordered"
                    {...register("email")}
                    errorMessage={errors.email?.message}
                    isInvalid={errors.email}
                  />
                  <DatePicker
                    autoFocus
                    label="Birth Date"
                    variant="bordered"
                    showMonthAndYearPickers
                    isRequired
                    onChange={(date) => {
                      setValue("dob", date);
                    }}
                  />
                </div>
                <div className="flex gap-5">
                  <Select
                    items={bloodGroups}
                    label="Blood Group"
                    placeholder="Select blood group"
                    variant="bordered"
                    className="flex-1"
                    errorMessage={errors.bloodGroup?.message}
                    {...register("bloodGroup")}
                    isInvalid={errors.bloodGroup}
                  >
                    {bloodGroups.map((item) => (
                      <SelectItem key={item.key} value={item.key}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex-1"></div>
                </div>
                <div className="flex gap-5">
                  <Textarea
                    label="Address"
                    placeholder="Enter address"
                    errorMessage={errors.address?.message}
                    {...register("address")}
                    isInvalid={errors.address}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={clearFormValues}
                >
                  Clear
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  Register
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
      <QrModal
        isOpen={isQrOpen}
        onOpenChange={onQrChange}
        onOpen={openQr}
        patientID={qrId}
        patientsData={patientsData}
      />
    </Modal>
  );
};

export default AddPatientModel;
