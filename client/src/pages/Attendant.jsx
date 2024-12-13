import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import Layout from "../layout/Layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import ScanQrModalAttendant from "../modal/ScanQrModalAttendant";

const Attendant = () => {
  const [datac, setData] = useState(null); // This state holds the currently selected patient's data
  const [queue, setQueue] = useState(null); // This holds the queue data fetched from the server
  const [refetch, setRefetch] = useState(false); // This triggers refetching of the queue data

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();

  // Function to add patient to the queue
  const addQueue = async () => {
    if (!datac || !datac._id) {
      toast.error("No patient data available to add to the queue.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/medical-record/queue/${datac._id}`
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        setRefetch(!refetch); // Trigger refetch to update queue
      }
    } catch (error) {
      console.error("Error adding patient to queue:", error);
      toast.error(
        error.response?.data?.message || "Failed to add patient to queue."
      );
    }
  };

  // Fetch queue data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/medical-record/queue/get`
        );

        if (response.status === 200) {
          setQueue(response.data); // Set queue data
        }
      } catch (error) {
        console.error("Error fetching queue data:", error);
      }
    };

    fetchData();
  }, [refetch]); // Refetch data when refetch state changes

  return (
    <Layout>
      {/* Header Section */}
      <div className="flex px-10 justify-between mt-5">
        <div className="flex flex-col items-center justify-between">
          <button
            className="bg-blue-700 rounded-lg w-28 mt-5 hover:bg-blue-900 text-white h-10 p-2"
            onClick={openModal}
            color="primary"
          >
            Scan
          </button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="">
            <div className="flex flex-col items-center justify-center w-44 text-center rounded-lg text-xl p-2 border-2">
              Patients In The Queue: {queue ? queue.queue.length : "0"}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Details Section */}
      <div className="flex flex-col mt-10">
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

        <div className="flex justify-center">
          <Button className="p-2 border mt-5 px-10 " color="primary" onClick={addQueue}>
            Add patient to the queue
          </Button>
        </div>
      </div>

      {/* Scan QR Modal */}
      <ScanQrModalAttendant
        setData={setData}
        isOpen={isModalOpen}
        onOpenChange={onModalChange}
      />

      {/* Patients Queue Section */}
      <div className="flex flex-col mt-10 px-10">
        <h2 className="text-lg font-semibold mb-2">Patients Queue:</h2>
        {queue && queue.queue && queue.queue.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-center">Queue Position</th>
                <th className="border px-4 py-2 text-center">Patient Name</th>
                <th className="border px-4 py-2 text-center">Patient ID Number</th>
                <th className="border px-4 py-2 text-center">Phone Number</th>
                <th className="border px-4 py-2 text-center">Added At</th>
              </tr>
            </thead>
            <tbody>
              {queue.queue.map((qItem, index) => (
                <tr
                  key={qItem?.item?._id || index}
                  className="bg-white shadow-md hover:bg-gray-200 cursor-pointer"
                  onClick={() => setData(qItem?.item)} // Set patient data on row click
                >
                  <td className="border px-4 py-2 text-gray-700 text-base text-center">
                    {index + 1}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-base text-center">
                    {qItem?.item?.firstName} {qItem?.item?.lastName}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-base text-center">
                    {qItem?.item?.idNumber || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-base text-center">
                    {qItem?.item?.phoneNumber || "N/A"}
                  </td>
                  <td className="border px-4 py-2 text-gray-700 text-base text-center">
                    {qItem?.createdAt ? new Date(qItem.createdAt).toLocaleString() : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Waiting for the patients queue...</p>
        )}
      </div>
    </Layout>
  );
};

export default Attendant;
