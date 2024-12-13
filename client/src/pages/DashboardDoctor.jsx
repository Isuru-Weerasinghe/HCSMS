import Layout from "../layout/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useDisclosure } from "@nextui-org/react";
import DoctorCards from "../components/DoctorCards";
import ScanQrModal from "../modal/ScanQrModal";
import ClinicHistoryTable from "../components/ClinicHistoryTable";
import PrescriptionHistoryTable from "../components/PrescriptionHistoryTable";
import XrayHistoryTable from "../components/xRayHistoryTable";
import AddMedicaleRecordModal from "../modal/AddMedicaleRecordModal";
import AddPrescriptionModal from "../modal/AddPrescriptionModal";
import AddXrayModal from "../modal/NewXrayModal";
import NewBloodReportModal from "../modal/NewBloodReportModal";
import ClinicDateModal from "../modal/ClinicDateModal";
import LabHistoryTable from "../components/LabHistoryTable";
import toast from "react-hot-toast";

const DashboardDoctor = () => {
  const [datac, setDatac] = useState(null);
  const [doc_name, setDocName] = useState(null);
  const [refetch, setRefetch] = useState(false); // State to trigger refetching
  const [docId, setDocId] = useState("")

  useEffect( () => { 
    const storedUser = localStorage.getItem("authUser");
    const parsedUser = JSON.parse(storedUser);
    setDocId(parsedUser._id)
  })

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();

  const {
    isOpen: isAddMedicaleRecordOpen,
    onOpen: openAddMedicaleRecord,
    onOpenChange: onAddMedicaleRecordChange,
  } = useDisclosure();

  const {
    isOpen: isAddPrescriptionOpen,
    onOpen: openAddPrescription,
    onOpenChange: onAddPrescriptionChange,
  } = useDisclosure();

  const {
    isOpen: isXrayOpen,
    onOpen: openXray,
    onOpenChange: onXrayChange,
  } = useDisclosure();

  const {
    isOpen: isBloodOpen,
    onOpen: openBlood,
    onOpenChange: onBloodChange,
  } = useDisclosure();

  const {
    isOpen: isClinicDateOpen,
    onOpen: openClinicDate,
    onOpenChange: onClinicDateChange,
  } = useDisclosure();

  // Retrieve the doctor_name from localStorage on component mount
  useEffect(() => {
    const storedDoctorName = localStorage.getItem("username");
    if (storedDoctorName) {
      setDocName(storedDoctorName);
    }
  }, []);

  // Function to remove patient from queue after successful scan
  const removePatientFromQueue = async (patientId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/medical-record/rm/queue/${patientId}`
      );
      if (response.data.message === "Patient removed from queue") {
        console.log("Patient successfully removed from queue");
      }
    } catch (error) {
      console.error("Error removing patient from queue:", error);
    }
  };

  // Function to handle scanning and removing patient from queue
  const handleScanSuccess = (scannedData) => {
    setDatac(scannedData);
    if (scannedData?._id) {
      removePatientFromQueue(scannedData._id);
    }
    // Toggle refetch to trigger DoctorCards to refetch data
    setRefetch(!refetch);
  };

  // Function to handle refetch after adding medical record
  const handleMedicalRecordAdd = () => {
    setRefetch(!refetch); // Toggle refetch to update tables
  };

  //Function to download patient's E-book
  const downloadEBook = () => {
    if (!datac?._id) {
      toast.error("Patient ID is required. Please scan the QR code.");
      return
    }
    const payload = {
      patientId: datac._id
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
  }
  
  

  return (
    <Layout>
      <div className="flex justify-start flex-col items-start">
        <div className="">
          <DoctorCards refetch={refetch} />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="mt-2">
            {/* Scan QR functionality can be added here */}
          </div>
          <button
            className="bg-blue-700 rounded-lg w-28 mt-5 hover:bg-blue-900 text-white h-10 p-2 "
            onClick={openModal}
            color="primary"
          >
            Scan
          </button>
        </div>
      </div>

      <div className="flex py-5">
        <div className="flex-1 px-5">
          {datac && (
            <h1 className="text-xl font-semibold text-center mt-1">
              Patient Details
            </h1>
          )}
          {!datac && (
            <div className="border rounded-lg h-60">
              <h1 className="text-2xl font-semibold text-center mt-5">
                Patient Details
              </h1>
              <h1 className="text-red-500 text-sm mt-10 text-center">
                No patient data found. Please scan a QR code.
              </h1>
            </div>
          )}

          <div className="flex mt-2 items-center justify-center">
            {datac && (
              <div className="flex w-[520px] gap-10 p-4 rounded-lg border items-center ">
                <div className="flex flex-col gap-2 ml-10">
                  <h1 className="">Patient Name :</h1>
                  <h1 className="">Id Number :</h1>
                  <h1 className="">Birth Day:</h1>
                  <h1 className="">Phone Number :</h1>
                  <h1 className="">Email :</h1>
                  <h1 className="">Address :</h1>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="text-blue-500">
                    {datac.firstName + " " + datac.lastName}
                  </div>
                  <div className="text-blue-500">{datac.idNumber}</div>
                  <div className="text-blue-500">
                    {new Date(datac.dob).toLocaleDateString()}
                  </div>
                  <div className="text-blue-500">{datac.phoneNumber}</div>
                  <div className="text-blue-500">{datac.email}</div>
                  <div className="text-blue-500">{datac.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 justify-center flex mt-1">
          <div className="flex flex-col gap-3">
            <button
              onClick={openAddMedicaleRecord}
              className="border px-20 py-2 rounded-lg border-white text-sm bg-blue-600 text-white hover:bg-blue-800"
            >
              Add Medical Record
            </button>
            <button
              onClick={openAddPrescription}
              className="border px-20 py-2 rounded-lg border-white text-sm bg-blue-600 text-white hover:bg-blue-800"
            >
              Add prescription
            </button>

            <button
              onClick={openXray}
              className="border px-20 py-2 rounded-lg border-white text-sm bg-blue-600 text-white hover:bg-blue-800"
            >
              X-ray Request
            </button>

            <button
              onClick={openBlood}
              className="border px-20 py-2 rounded-lg border-white text-sm bg-blue-600 text-white hover:bg-blue-800"
            >
              Lab Report Request
            </button>

            <button
              onClick={openClinicDate}
              className="border px-20 py-2 rounded-lg border-white text-sm bg-blue-600 text-white hover:bg-blue-800"
            >
              Next Clinic Date
            </button>
            <button
              onClick={downloadEBook}
              className="border px-20 py-2 rounded-lg border-white text-sm bg-blue-600 text-white hover:bg-blue-800"
            >
              Download E-book
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <ClinicHistoryTable patientId={datac?._id} triggerRefetch={refetch} />
      </div>
      <div className="flex justify-center">
        <PrescriptionHistoryTable patientId={datac?._id} triggerRefetch={refetch} />
      </div>
      <div className="flex justify-center">
        <XrayHistoryTable patientId={datac?._id} triggerRefetch={refetch} />
      </div>
      <div className="flex justify-center">
        <LabHistoryTable patientId={datac?._id} triggerRefetch={refetch} />
      </div>

      <ScanQrModal
        setDatac={handleScanSuccess}
        isOpen={isModalOpen}
        onOpenChange={onModalChange}
      />
      <AddMedicaleRecordModal
        isOpen={isAddMedicaleRecordOpen}
        onOpenChange={onAddMedicaleRecordChange}
        datac={datac}
        docName={doc_name}
        onAddMedicalRecord={handleMedicalRecordAdd} // Pass refetch handler to modal
      />

      <AddPrescriptionModal
        isOpen={isAddPrescriptionOpen}
        onOpenChange={onAddPrescriptionChange}
        datac={datac}
        docName={doc_name}
        onAddPrescription={handleMedicalRecordAdd}
      />

      <AddXrayModal
        isOpen={isXrayOpen}
        onOpenChange={onXrayChange}
        datac={datac}
        docName={doc_name}
        onAddXray={handleMedicalRecordAdd}
      />

      <NewBloodReportModal
        isOpen={isBloodOpen}
        onOpenChange={onBloodChange}
        datac={datac}
        docName={doc_name}
        onAddLab={handleMedicalRecordAdd}
      />
      <ClinicDateModal
        isOpen={isClinicDateOpen}
        onOpenChange={onClinicDateChange}
        datac={datac}
        docName={doc_name}
        docId={docId}
      />
    </Layout>
  );
};

export default DashboardDoctor;
