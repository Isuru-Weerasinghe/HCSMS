import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import Layout from "../layout/Layout";

const DashboardAddStaff = () => {
  const roles = [
    { key: "0", label: "Admin" },
    { key: "1", label: "Doctor" },
    { key: "2", label: "Nurse" },
    { key: "3", label: "Receptionist" },
    { key: "4", label: "Pharmacist" },
  ];

  return (
    <Layout>
      <div className="flex items-center  flex-col ">
        <div className="w-[500px]">
          <h1 className="text-2xl text-center font-semibold mt-5">Add Staff</h1>
          <form className="px-10 py-5 flex gap-2 flex-col">
            <Input type="email" label="Email" placeholder="Enter your email" />
            <Input type="text" label="Name" placeholder="Enter your email" />
            <Select
              label="Role"
              placeholder="Select role"
              className=""
            >
              {roles.map((role) => (
                <SelectItem key={role.key}>{role.label}</SelectItem>
              ))}
            </Select>
            <Input
              type="text"
              label="Password"
              placeholder="Enter your email"
            />
            <Button color="primary" className="mt-2">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};
export default DashboardAddStaff;
