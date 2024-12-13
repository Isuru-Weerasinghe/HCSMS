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
import { roles } from "../data/bloodGroups";
import axios from "axios";
import { useGlobalRefetch } from "../store/store";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
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
  address: yup.string().required("Address is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  dob: yup.date().required("Date of birth is required"),
});

const EditDoctorModel = ({
  isOpen,
  onOpenChange,
  selectedDoctor,
  setSelectedDoctor,
  setRefetch,
  refetch,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, disabled },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { setGlobalRefetch } = useGlobalRefetch();
  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/auth/${selectedDoctor._id}`,
        data
      );
      setGlobalRefetch(true);
      setSelectedDoctor(null);
      setSelectedDoctor(res.data.patient);
      onOpenChange();
    } catch (error) {
      console.log(error);
    }

    
  };

  const clearFormValues = () => {
    reset();
  };

  setValue("username", selectedDoctor?.username);
  setValue("idNumber", selectedDoctor?.idNumber);
  setValue("phoneNumber", selectedDoctor?.phoneNumber);
  setValue("bloodGroup", selectedDoctor?.bloodGroup);
  setValue("address", selectedDoctor?.address);
  setValue("email", selectedDoctor?.email);
  setValue("dob", selectedDoctor?.dob);
  // setValue("role", selectedDoctor?.role);
  // setValue("slmcNumber", selectedDoctor?.slmcNumber);

  const selectedRole = watch("role");
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
              Edit Doctor
            </ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <div className="flex gap-5">
                  <Input
                    autoFocus
                    label="Username"
                    placeholder="Enter your username"
                    variant="bordered"
                    {...register("username")}
                    errorMessage={errors.username?.message}
                    isInvalid={errors.username}
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
                  <Input
                    label="DOB"
                    placeholder="Enter Date of Birth"
                    variant="bordered"
                    {...register("dob")}
                    isDisabled
                    value={selectedDoctor?.dob}
                  />
                </div>
                {/* <div className="flex gap-5">
                  <Select
                    items={roles}
                    label="Role"
                    placeholder="Select Role"
                    variant="bordered"
                    className="flex-1"
                    errorMessage={errors.role?.message}
                    {...register("role")}
                    isInvalid={errors.role}
                  >
                    {roles.map((item) => (
                      <SelectItem key={item.key} value={item.key}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex-1 gap-5"></div>
                </div>
                {selectedRole === "doctor" && (
                  <div className="flex gap-5">
                    <Input
                      label="SLMC Number"
                      placeholder="Enter SLMC Number"
                      variant="bordered"
                      errorMessage={errors.slmcNumber?.message}
                      {...register("slmcNumber")}
                      isInvalid={errors.slmcNumber}
                    />  
                  </div>
                )} */}
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
                <Button color="primary" type="submit">
                  Register
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default EditDoctorModel;
