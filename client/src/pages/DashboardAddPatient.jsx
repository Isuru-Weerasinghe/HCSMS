import PatientsList from "../components/PatientsList";
import RegistrarCards from "../components/Registrarcards";
import Layout from "../layout/Layout";
import { useState } from "react";

const DashboardAddPatient = () => {
  const [refetchRegistrarCards, setRefetchRegistrarCards] = useState(false);

  return (
    <Layout>
      <RegistrarCards refetch={refetchRegistrarCards} />
      <div className="flex w-full justify-center items-center h-[500px]">
        <PatientsList setRefetchRegistrarCards={setRefetchRegistrarCards} />
      </div>
    </Layout>
  );
};

export default DashboardAddPatient;
