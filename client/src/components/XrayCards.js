import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";

const CardStarter = (refetch) => {
  const [date, setDate] = useState(getDateTime());
  const [time, setTime] = useState(getTime());
  const [patientsCount, setPatientsCount] = useState(0); // State for total patients
  const [xrayCountToday, setXrayCountToday] = useState(0); // State for total X-rays issued today
  const [xrayQueueCount, setXrayQueueCount] = useState(0); // State for X-rays in the queue
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [patientQueue, setPatientQueue] = useState([]); // State to hold patient queue details

  // Fetch total patients, staff count, X-ray counts when the component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch total patients count
        const patientsResponse = await axios.get("http://localhost:5000/patients");
        setPatientsCount(patientsResponse.data.patients.length);

        // Fetch total X-rays in the queue
        const xrayQueueResponse = await axios.get("http://localhost:5000/medical-record/xqueue/getCount");
        setXrayQueueCount(xrayQueueResponse.data.totalInQueue);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [refetch]);

  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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

  function getDateTime() {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  function getTime() {
    const date = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleTimeString("en-US", options);
  }

  return (
    <div className="flex justify-between gap-10">
      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <CiCalendarDate size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Date</h1>
          <h2 className="text-gray-700 text-sm">{date}</h2>
        </div>
      </div>

      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <CiTimer size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Time</h1>
          <h2 className="text-gray-700 text-sm">{time}</h2>
        </div>
      </div>

      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Total Patients in the system</h1>
          <h2 className="text-gray-700 text-sm">{patientsCount}</h2> {/* Display total X-rays issued today */}
        </div>
      </div>

      <div
        className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg cursor-pointer"
        onClick={fetchPatientQueue}
      >
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">X-rays in the queue</h1>
          <h2 className="text-gray-700 text-sm">{xrayQueueCount}</h2> {/* Display X-ray count in the queue */}
        </div>
      </div>

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
                </tr>
              </thead>
              <tbody>
                {patientQueue.map((queueItem, index) => (
                  <tr
                    key={queueItem._id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => console.log("Clicked row for:", queueItem.patientId)}
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">
                      {`${queueItem.patientId.firstName} ${queueItem.patientId.lastName}`}
                    </td>
                    <td className="border px-4 py-2">{queueItem.patientId.idNumber}</td>
                    <td className="border px-4 py-2">{queueItem.patientId.phoneNumber}</td>
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
    </div>
  );
};

export default CardStarter;
