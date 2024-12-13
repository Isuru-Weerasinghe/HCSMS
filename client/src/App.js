import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import About from "./pages/About";
import Courses from "./pages/Courses";
import OurStaff from "./pages/OurStaff";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ContactUsPage from "./pages/ContactUs";
import DashboardAddPatient from "./pages/DashboardAddPatient";
import DashboardAddStaff from "./pages/DashboardAddStaff";
import DashboardDoctor from "./pages/DashboardDoctor";
import DashboardParmacy from "./pages/DashboardParmacy";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import PatientPage from "./pages/Patient";
import Raidiology from "./pages/Raidiology";
import Laboratory from "./pages/Labortory";
import Radiology from "./pages/Raidiology";
import Attendant from "./pages/Attendant";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/staff" element={<OurStaff />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/patient" element={<PatientPage />} />
        <Route
          path="/dashboard/add-patient"
          element={<DashboardAddPatient />}
        />
        <Route path="/dashboard/add-staff" element={<DashboardAddStaff />} />
        <Route path="/dashboard/doctor" element={<DashboardDoctor />} />
        <Route path="/dashboard/pharmacy" element={<DashboardParmacy />} />
        <Route path="/dashboard/x-ray" element={<Radiology />} />
        <Route path="/dashboard/laboratory" element={<Laboratory />} />
        <Route path="/dashboard/attendant" element={<Attendant />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
