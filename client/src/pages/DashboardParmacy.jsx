import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { Button, Checkbox, CheckboxGroup, useDisclosure } from "@nextui-org/react";
import ScanQrModalParamarcy from "../components/ScanQrModalParamarcy";
import axios from "axios";
import PrintModel from "../modal/PrintModel";
import PrescriptionHistoryTable from "../components/PrescriptionHistoryTable";
import PharmacyCards from "../components/PhamacyCards";

const DashboardPharmacy = () => {
  const [datac, setData] = useState(null); // Patient data from QR code
  const [prescription, setPrescription] = useState([]);
  const [unavailableDrugs, setUnavailableDrugs] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState('');
  const [pharmacistName, setPharmacistName] = useState(null);
  const [age, setAge] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();

  const {
    isOpen: isPrintModalOpen,
    onOpen: openPrintModal,
    onOpenChange: onPrintModalChange,
  } = useDisclosure();

  useEffect(() => {
    if (datac) {
      fetchPrescriptionData(datac._id); // Fetch prescription after scanning QR
    }
  }, [datac]);

  const fetchPrescriptionData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/medical-record/${id}`);

      if (response.data) {
        const { prescription, docName, date } = response.data;
        const prescriptionData = prescription ? prescription.split(",") : [];
        setPrescription(prescriptionData);
        setDoctorName(docName || 'Unknown doctor');
        setPrescriptionDate(date ? new Date(date).toLocaleDateString() : 'Unknown date');
      } else {
        setPrescription([]);
        setDoctorName('Unknown doctor');
        setPrescriptionDate('Unknown date');
      }
    } catch (error) {
      console.error("Error retrieving prescription:", error);
      setPrescription([]);
      setDoctorName('Unknown doctor');
      setPrescriptionDate('Unknown date');
    }
  };

  // Retrieve pharmacist's name from localStorage on component mount
  useEffect(() => {
    const pharmacist = localStorage.getItem("username");
    if (pharmacist) {
      setPharmacistName(pharmacist);
    }
  }, []);

  // Retrieve the age of the patient
  useEffect(() => {
    if (datac && datac.dob) {
      const calculatedAge = calculateAge(new Date(datac.dob));
      setAge(calculatedAge);
    }
  }, [datac]);

  // Function to calculate age
  const calculateAge = (birthdate) => {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    return age;
  };

  // Set the current date
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setCurrentDate(today);
  }, []);

  return (
    <Layout>
    <div className="">
          <PharmacyCards />
        </div>
      <div className="flex px-10">
        <div className="flex flex-col items-center justify-center">
          <button
            className="bg-blue-700 rounded-lg w-28 mt-5 hover:bg-blue-900 text-white h-10 p-2"
            onClick={openModal}
            color="primary"
          >
            Scan
          </button>
        </div>
      </div>

      <div className="flex flex-row mt-10">
        <div className="flex-1 px-5">
          {datac ? (
            <h1 className="text-xl font-semibold text-center mt-1">Patient Details</h1>
          ) : (
            <div className="border rounded-lg h-60">
              <h1 className="text-2xl font-semibold text-center mt-5">Patient Details</h1>
              <h1 className="text-red-500 text-sm mt-10 text-center">
                No patient data found. Please scan a QR code.
              </h1>
            </div>
          )}
          <div className="flex mt-2 items-center justify-center">
            {datac && (
              <div className="flex w-[520px] gap-10 p-4 rounded-lg border items-center">
                <div className="flex flex-col gap-2 ml-10">
                  <h1>Patient Name:</h1>
                  <h1>Patient Age:</h1>
                  <h1>Id Number:</h1>
                  <h1>Phone Number:</h1>
                  <h1>Email:</h1>
                  <h1>Address:</h1>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-blue-500">
                    {datac.firstName + " " + datac.lastName}
                  </div>
                  <div className="text-blue-500">{age} years</div>
                  <div className="text-blue-500">{datac.idNumber}</div>
                  <div className="text-blue-500">{datac.phoneNumber}</div>
                  <div className="text-blue-500">{datac.email}</div>
                  <div className="text-blue-500">{datac.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 px-5 border rounded-lg">
          <h1 className="text-2xl font-semibold text-center mt-5">Prescription List</h1>
          <div>
            {datac && (
              <div className="flex flex-col gap-2 mt-5">
                <div className="flex">
                  <p className="font-semibold">Issued by:</p>
                  <p className="ml-2">Dr. {doctorName}</p>
                </div>
                <div className="flex">
                  <p className="font-semibold">Issued Date:</p>
                  <p className="ml-2">{prescriptionDate}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 ml-10 justify-center">
            {prescription.length > 0 ? (
              <div className="flex w-[500px] flex-col gap-3 mt-3 mr-10 p-2">
                <CheckboxGroup
                  label="Select the drugs that are unavailable:"
                  onChange={(value) => setUnavailableDrugs(value)}
                >
                  {prescription.map((item, index) => (
                    <Checkbox key={index} value={item}>
                      {item}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </div>
            ) : (
              <h1 className="text-red-500 text-sm mt-10 text-center">
                No prescription found. Please scan a QR code.
              </h1>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5 p-5 rounded-lg w-[500px] mx-auto">
        <Button color="primary" className="items-center" onClick={openPrintModal}>
          Print unavailable drugs
        </Button>
      </div>

      {/* Scan QR Modal */}
      <ScanQrModalParamarcy setData={setData} isOpen={isModalOpen} onOpenChange={onModalChange} />

      {/* Print Modal */}
      <PrintModel
        isOpen={isPrintModalOpen}
        onOpenChange={onPrintModalChange}
        unavailableDrugs={unavailableDrugs}
        pharmacistName={pharmacistName}
        patientName={datac ? `${datac.firstName} ${datac.lastName}` : ''}
        patientAge={age}
        currentDate={currentDate}
      />

    <div className="flex justify-center">
        <PrescriptionHistoryTable patientId={datac?._id} />
      </div>
    </Layout>
  );
};

export default DashboardPharmacy;
