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
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { bloodGroups } from "../data/bloodGroups";
import axios from "axios";
import { useGlobalRefetch } from "../store/store";
import toast from "react-hot-toast"; // Import toast for notifications

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

const EditPatientModel = ({
  isOpen,
  onOpenChange,
  selectedPatient,
  setSelectedPatient,
  setRefetch
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, disabled },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { setGlobalRefetch } = useGlobalRefetch();

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/patients/${selectedPatient._id}`,
        data
      );
      toast.success("Patient updated successfully!"); // Show success notification
      setGlobalRefetch((prev) => !prev);
      setRefetch(prev => !prev);
      setSelectedPatient(null);
      setSelectedPatient(res.data.patient);
    } catch (error) {
      toast.error("Failed to update patient."); // Show error notification
      console.log(error);
    }

    onOpenChange();
  };

  const clearFormValues = () => {
    reset();
  };

  setValue("firstName", selectedPatient?.firstName);
  setValue("lastName", selectedPatient?.lastName);
  setValue("idNumber", selectedPatient?.idNumber);
  setValue("phoneNumber", selectedPatient?.phoneNumber);
  setValue("bloodGroup", selectedPatient?.bloodGroup);
  setValue("address", selectedPatient?.address);
  setValue("email", selectedPatient?.email);
  setValue("dob", selectedPatient?.dob);

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
              Edit Patient
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-5">
                <Input
                  autoFocus
                  label="First Name"
                  placeholder="Enter your first name"
                  variant="bordered"
                  {...register("firstName")}
                  isDisabled
                />
                <Input
                  label="Last Name"
                  placeholder="Enter your last name"
                  variant="bordered"
                  {...register("lastName")}
                  isDisabled
                />
              </div>
              <div className="flex gap-5">
                <Input
                  label="ID Number"
                  placeholder="Enter ID Number"
                  variant="bordered"
                  {...register("idNumber")}
                  isDisabled
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
                  label="Email"
                  placeholder="Enter Email Address"
                  variant="bordered"
                  {...register("email")}
                  errorMessage={errors.email?.message}
                  isInvalid={errors.email}
                />
                <Input
                  label="DOB"
                  placeholder="Enter Date of Birth"
                  variant="bordered"
                  {...register("dob")}
                  isDisabled
                  value={selectedPatient?.dob}
                />
              </div>
              <div className="flex gap-5">
                <Select
                  items={bloodGroups}
                  label="Blood Group"
                  placeholder="Select blood group"
                  variant="bordered"
                  className="flex-1"
                  {...register("bloodGroup")}
                  isDisabled
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
                  variant="bordered"
                  errorMessage={errors.address?.message}
                  {...register("address")}
                  isInvalid={errors.address}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={handleSubmit(onSubmit)}
                disabled={disabled}
              >
                Edit
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditPatientModel;
