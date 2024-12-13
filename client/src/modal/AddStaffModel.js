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
import toast from "react-hot-toast";
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
  role: yup.string().required("Role is required"),
  address: yup.string().required("Address is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  dob: yup.date().required("Date of birth is required"),
});

const AddStaffModel = ({ isOpen, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { setGlobalRefetch } = useGlobalRefetch();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/staff", data);

      console.log("Response:", res); // Log the response to check its status and data

      if (res.status === 201) {
        toast.success("Staff member added successfully.login credentials has been sent.",{duration:5000});
        
        setGlobalRefetch(true);
        onOpenChange(false);
        reset();
      } else if (res.status === 400) {
        toast.error("member is already exists");
      } else {
        toast.error("An unexpected status code was returned");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error:", error.response);
        if (error.response.status === 400) {
          toast.error("Staff member is already exists");
        } else {
          toast.error(
            `An error occurred: ${error.response.status} - ${error.response.data.message}`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request error:", error.request);
        toast.error("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
        toast.error(`An error occurred: ${error.message}`);
      }
      console.error("Error while adding staff:", error);
    }
  };

  const clearFormValues = () => {
    reset();
  };
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
            <ModalHeader className="flex flex-col gap-1">Register New Staff Member</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <div className="flex gap-5">
                  <Input
                    autoFocus
                    label="Full Name"
                    placeholder="Enter full name"
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
                )}
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

export default AddStaffModel;
