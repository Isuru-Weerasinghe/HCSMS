import { useEffect } from "react";
import PatientNav from "../components/PatientNav"
import SideBar from "../components/SideBar";

const Layout = ({ children }) => {
  

  return (
    <div className="flex w-screen ">
      <SideBar />
      <div className="w-full px-5 p-2  ">
        <PatientNav />
        {children}
      </div>
    </div>
  );
};
export default Layout;
