import { Button, useDisclosure } from "@nextui-org/react";
import AdminCardS from "../components/AdminCards";
import DoctorListAdmin from "../components/DoctorListAdmin";
import PatientsList from "../components/PatientsList";
import PatientsListAdmin from "../components/PatientsListAdmin";
import Layout from "../layout/Layout";
import AddStaffModel from "../modal/AddStaffModel";
import LabStaffList from "../components/LabStaffList";
import XrayStaff from "../components/XrayStaff";
import AttendantStaff from "../components/AttendentStaff";
import PharmacyStaff from "../components/PharmacyStaff";
import { useEffect } from "react";
import RegistarStaff from "../components/RegistarStaff";

const Dashboard = () => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();

  

  return (
    <Layout>
      <div className="flex items-center justify-center flex-col ">
        <div className=" ">
          <AdminCardS />
        </div>
        <div className="flex  w-full justify-end items-end pr-[15%] mt-10">
          <Button onPress={openModal} color="primary">
            Add New Member
          </Button>
        </div>
        <div className="px-10 mt-2 py-5">
          <PatientsListAdmin />
        </div>
        <div className="px-10 mt-2 py-5">
          <DoctorListAdmin />
        </div>
        <div className="px-10 mt-2 py-5">
          <LabStaffList />
        </div>
        <div className="px-10 mt-2 py-5">
          <XrayStaff />
        </div>

        <div className="px-10 mt-2 py-5">
          <AttendantStaff />
        </div>

        <div className="px-10 mt-2 py-5">
          <PharmacyStaff />
        </div>

        <div className="px-10 mt-2 py-5">
          <RegistarStaff />
        </div>
      </div>
      <AddStaffModel isOpen={isModalOpen} onOpenChange={onModalChange} />
    </Layout>
  );
};
export default Dashboard;
