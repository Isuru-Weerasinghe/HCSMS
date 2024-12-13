import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../icon/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import backgroundImage from '../assets/loginBackground.jpg';

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    isTouchField,
  } = useForm({
    resolver: yupResolver(formSchema),
  });

  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", data);
      if (res.status === 200) {
        toast.success("Login successfully");

        localStorage.setItem("authUser", JSON.stringify(res.data.user));
        localStorage.setItem("username", res.data.user.username);

        switch (res.data.user.role) {
          case "admin":
            navigate("/dashboard");
            break;
          case "patient":
            navigate("/dashboard/patient");
            break;
          case "doctor":
            navigate("/dashboard/doctor");
            break;
          case "registar":
            navigate("/dashboard/add-patient");
            break;
          case "attendant":
            navigate("/dashboard/attendant");
            break;
          case "laboratorist":
            navigate("/dashboard/laboratory");
            break;
          case "rediologist":
            navigate("/dashboard/x-ray");
            break;
          case "pharmacist":
            navigate("/dashboard/pharmacy");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (error) {
      if (error?.response) {
        toast.error(error.response.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="fixed flex h-full w-full flex-col items-center justify-center px-10"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Use the local image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="flex w-[500px] bg-white h-[400px] items-center justify-center rounded-lg shadow-lg p-8"
        style={{
          background: "rgba(255, 255, 255, 0.85)", // Semi-transparent background
          backdropFilter: "blur(10px)", // Add blur effect
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Enhanced shadow
          borderRadius: "16px", // Smooth round corners
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-96 flex-col gap-4"
        >
          <div className="flex flex-col items-center justify-center">
            <h1
              className="mb-5 font-serif text-2xl font-bold text-black"
              style={{
                color: "#333", // Darker heading color
                letterSpacing: "1px", // Add letter spacing
                textTransform: "uppercase", // Transform text
              }}
            >
              Login to your account
            </h1>
          </div>

          <Input
            size="md"
            variant="filled"
            type="text"
            label="Email"
            placeholder="Enter your email"
            {...register("email")}
            touched={isTouchField}
            isInvalid={errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            size="md"
            variant="filled"
            label="Password"
            placeholder="Enter your password"
            {...register("password")}
            isInvalid={errors.password}
            errorMessage={errors.password?.message}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
                ) : (
                  <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />

          <Button
            type="submit"
            size="lg"
            className="bg-blue-500 font-bold text-white"
            style={{
              transition: "all 0.3s ease", // Smooth transition for hover
            }}
            isLoading={isSubmitting}
            css={{
              '&:hover': {
                backgroundColor: '#1A73E8', // Change color on hover
                transform: 'scale(1.05)', // Scale up slightly on hover
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Shadow effect on hover
              },
            }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
