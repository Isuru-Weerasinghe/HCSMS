import { useEffect, useState } from "react";
import PatientLayout from "../layout/PatientLayout";
import PatientsMedicalHistory from "../components/PatientsMedicalHistory";
import MyFeedbacks from "../components/MyFeedbacks";
import { Button, useDisclosure } from "@nextui-org/react";
import RequestNewAppointment from "../modal/RequestNewAppointment";
import axios from "axios";
import toast from "react-hot-toast";

const PatientPage = () => {
  const [nextClinicDate, setNextClinicDate] = useState("no appointment");
  const [myemail, setMyemail] = useState(null);
  const [clincIssuedBy, setClinicIssuedBy] = useState('');
  const [patientId , setPatientId] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
  
    if (!authUser) {
      window.location.href = "/login";
      return;
    }
  
    const parsedUser = JSON.parse(authUser);
    setUser(parsedUser);
    setMyemail(parsedUser.email);
    setLoading(false); // Set loading to false after email is set
  
    axios.get(`http://localhost:5000/patients/email2id/${parsedUser.email}`)
      .then((response) => {
        const patientId = response.data.patientId;
        setPatientId(patientId);
  
        // Get next clinic date
        return axios.get(`http://localhost:5000/medical-record/appointments/${patientId}`);
      })
      .then((response) => {
        const data = response.data;
        if (data.message === "appointment") {
          const date = new Date(data.appointment.date);
          setClinicIssuedBy(data.appointment.doctorId);
          setNextClinicDate(date);
        } else {
          setNextClinicDate("no appointment");
        }
      })
      .catch(error => console.error("Error fetching patient or appointment data:", error));
  }, []);
  

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();

  const ClickOpen = () => {
    openModal();
  };
  const handleShowMore = () => {
    openModal();
  };

  // Download full report
  const fullReportDownload = () => {
    const payload = {
      patientId: patientId
    };

    axios.post("http://localhost:5000/report/full", payload, {
      responseType: 'blob'
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement('a');
      link.href = url;

      const fileName = response.headers['content-disposition'] 
                        ? response.headers['content-disposition'].split('filename=')[1] 
                        : 'Full_Report.pdf';
                        
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error('Error downloading the report:', error);
    });
  };

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while data is being fetched
  }

  return (
    <PatientLayout>
      <div className="flex justify-center items-center mt-10  flex-col  ">
      <div> 
          <PatientsMedicalHistory />
        <div className="flex">
          <Button color="primary" className="mt-10 ml-[600px]" onClick={fullReportDownload}>
            Download E-Book
          </Button>
        </div>
        <div>
          <div className="mt-10 flex p-2 border-2 w-[800px] rounded-md">
            Next Clinic Date :
            <span className="ml-20">
              {nextClinicDate != "no appointment" ? (
                <span>{nextClinicDate.getFullYear()}/{nextClinicDate.getMonth()+1}/{nextClinicDate.getDate()}</span>
              ) : "No Appointment"}
            </span>
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={() => handleShowMore()}
            color="primary"
            className="mt-10 ml-[600px]"
          >
            Request to new Appointment
          </Button>
        </div>

        {myemail ? (
            <MyFeedbacks myemail={myemail} />
          ) : (
            toast.error("User email not available")
          )}

      </div>
      </div>
      <RequestNewAppointment
        patientId = {patientId}
        doctorId={clincIssuedBy}
        isOpen={isModalOpen}
        onOpenChange={onModalChange}
      />
    </PatientLayout>
  );
};
export default PatientPage;
