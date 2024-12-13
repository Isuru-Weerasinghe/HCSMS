import { useEffect } from "react";
import DashBordNav from "../components/DashBordNav";
import SideBar from "../components/SideBar";

const Layout = ({ children }) => {
  

  return (
    <div className="flex w-screen ">
      <SideBar />
      <div className="w-full px-5 p-2  ">
        <DashBordNav />
        {children}
      </div>
    </div>
  );
};
export default Layout;
