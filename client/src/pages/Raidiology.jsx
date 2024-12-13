import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Layout from "../layout/Layout";
import Xraycards from "../components/XrayCards"
import ScanQrModalParamarcy from "../components/ScanQrModalParamarcy";
import ScanQrModalRaidiology from "../modal/ScanQrModalRaidiology";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Radiology = () => {
  const [page, setPage] = useState(1);
  const [datac, setData] = useState(null);
  const [age, setAge] = useState('');
  const [x, setX] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const rowsPerPage = 6;
  const pages = Math.ceil(x.length / rowsPerPage);
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [patientQueue, setPatientQueue] = useState([]); // State to hold patient queue details

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return x.slice(start, end);
  }, [page, x]);

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();
  // console.log(x[x.length - 1].xray);
  useEffect(() => {
    const fetchXrayData = async () => {
      if (datac) {
        try {
          // const response = await fetch(`http://localhost:5000/patients/${id}`, {
          const response = await fetch(
            `http://localhost:5000/medical-record/xray/${datac?._id}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status === 404) {
            toast.error("Xray not found.");
          } else if (response.status === 200) {
            const data = await response.json();
            const xray = data;

            setX(xray);
            // toast.success("Successfully retrieved Xray.");
          }
        } catch (error) {
          console.error("Error retrieving Xray:", error);
          toast.error("Failed to retrieve Xray.");
        } finally {
        }
      }
    };
    fetchXrayData();
  }, [datac, refetch]);

  const deliverdXray = async () => {
    console.log(datac);
    try {
      // Mark the X-ray as delivered
      const response = await fetch(
        `http://localhost:5000/medical-record/xray/delivered/${x[x.length - 1]?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: datac.firstName,
            lastName: datac.lastName,
            phoneNumber: datac.phoneNumber,
          }),
        }
      );
  
      if (response.status === 200) {
        toast.success("Xray delivered successfully.");
        
        //remove the patient from the X-ray queue
        const removeResponse = await fetch(`http://localhost:5000/medical-record/xqueue/remove/${datac._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
  
        if (removeResponse.status === 200) {
        } else {
          toast.error("Failed to remove patient from the queue.");
        }
  
        setRefetch(!refetch); // Trigger a refetch to update the displayed data
      } else {
        toast.error("Failed to deliver Xray.");
      }
    } catch (error) {
      console.error("Error delivering Xray:", error);
      toast.error("Failed to deliver Xray.");
    }
  };
  

  //retrive the age of the patient
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

  // add to x-ray queue
  const addToQueue = async () => {
    if (!datac || !datac._id) {
      toast.error("No patient data available to add to the queue.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/medical-record/addToXqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: datac._id }), 
      });
  
      if (response.status === 200) {
        toast.success("Patient successfully added to the X-ray queue.");
        setRefetch(!refetch);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add patient to the queue.");
      }
    } catch (error) {
      console.error("Error adding patient to queue:", error);
      toast.error("An error occurred while adding the patient to the queue.");
    }
  };

  // Fetch patient queue and display in the modal
  const fetchPatientQueue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/medical-record/xqueue/getData");
      setPatientQueue(response.data.queue); // Set the patient queue data
      setShowModal(true); // Show modal when data is fetched
    } catch (error) {
      console.error("Error fetching patient queue:", error);
    }
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };
  

  return (
    <Layout>
        <div className="">
          <Xraycards refetch={refetch} />
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
            <h1 className="text-xl font-semibold text-center mt-1">
              Patient Details
            </h1>
          ) : (
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
              <div className="flex w-[520px] gap-10 p-4 rounded-lg border items-center">
                <div className="flex flex-col gap-2 ml-10">
                  <h1>Patient Name:</h1>
                  <h1>Patient Age:</h1>
                  <h1>Id Number:</h1>
                  <h1>Birth Day:</h1>
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
        <div className="flex-1 px-5">
          {x ? (
            <h1 className="text-xl font-semibold text-center mt-1">
              X Ray Details
            </h1>
          ) : (
            <div className="border rounded-lg h-60">
              <h1 className="text-2xl font-semibold text-center mt-5">
                X Ray Details
              </h1>
              <h1 className="text-red-500 text-sm mt-10 text-center">
                Not available
              </h1>
            </div>
          )}
          <div className="flex mt-2 items-center justify-center">
            {
              x && (
                // x?.map((data) => (
                <div className="flex w-[520px] gap-10 p-4 rounded-lg border items-center">
                  <div className="flex flex-col gap-2 ml-10">
                    <h1>Issued by Dr. </h1>
                    <h1>Issued date:</h1>
                    <h1>Description</h1>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="text-blue-500">
                      {x[x.length - 1]?.xrayIssued}
                    </div>
                    <div className="text-blue-500">
                      {new Date(x[x.length - 1]?.date).toLocaleDateString()}
                    </div>
                    <div className="text-blue-500">{x[x.length - 1]?.xray}</div>
                  </div>
                </div>
              )
              // ))
            }
          </div>
          <div className="w-full flex justify-center mt-10">
            <Button onClick={() => deliverdXray()} color="danger">
              Xray is ready
            </Button> &nbsp;&nbsp;&nbsp;
            <Button color="success" onClick={addToQueue}>
              Add to Queue
            </Button> &nbsp;&nbsp;&nbsp;
            <Button color="primary" onClick={fetchPatientQueue}>
              Show Queue
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center mt-16">
        <div className="w-[1000px] mt-2">
        <div className="flex justify-between p-2">
        <h1 className="text-center mt-2 font-semibold">Patient X-Ray History</h1>
      </div>
          <Table
            aria-label="Example static collection table"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>Id</TableColumn>
              <TableColumn>Issued By</TableColumn>
              <TableColumn>Date</TableColumn>
              <TableColumn>Description</TableColumn>
              <TableColumn>Delivered</TableColumn>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>Dr. {item.xrayIssued}</TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{item.xray}</TableCell>
                  <TableCell>
                    {item.delivered ? "Delivered" : "Not Delivered"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ScanQrModalRaidiology
        setData={setData}
        isOpen={isModalOpen}
        onOpenChange={onModalChange}
      />


      {/* Modal for displaying patient queue */}
          {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg z-60">
              <h2 className="text-lg font-semibold mb-4">Patient Queue</h2>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2">Full Name</th>
                    <th className="px-4 py-2">ID Number</th>
                    <th className="px-4 py-2">Phone Number</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2" hidden>Date of Birth</th>
                    <th className="px-4 py-2" hidden>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {patientQueue.map((queueItem, index) => (
                    <tr
                      key={queueItem._id}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setData(queueItem.patientId);
                        setShowModal(false);
                        setRefetch(!refetch); // Trigger the refetch for X-ray details
                      }}
                    >
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">
                        {`${queueItem.patientId.firstName} ${queueItem.patientId.lastName}`}
                      </td>
                      <td className="border px-4 py-2">{queueItem.patientId.idNumber}</td>
                      <td className="border px-4 py-2">{queueItem.patientId.phoneNumber}</td>
                      <td className="border px-4 py-2">{queueItem.patientId.email}</td>
                      <td className="border px-4 py-2" hidden>{queueItem.patientId.dob}</td>
                      <td className="border px-4 py-2" hidden>{queueItem.patientId.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        )}


    </Layout>
  );
};
export default Radiology;
