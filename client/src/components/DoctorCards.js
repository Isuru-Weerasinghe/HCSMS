import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";
import toast from "react-hot-toast";

const CardStarter = ({ refetch }) => {
  const [date, setDate] = useState(getDateTime());
  const [time, setTime] = useState(getTime());
  const [patientsCount, setPatientsCount] = useState(0); // State for total patients
  const [queueCount, setQueueCount] = useState(0); // State for total patients in queue
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedDate, setSelectedDate] = useState(""); // State for selected date in modal
  const [appointments, setAppointments] = useState([]); // State to hold fetched appointments
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false); // To display appointments

  // Fetch total patients and queue count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const patientsResponse = await axios.get("http://localhost:5000/patients");
        setPatientsCount(patientsResponse.data.patients.length);

        const queueResponse = await axios.get("http://localhost:5000/medical-record/queue/get");
        setQueueCount(queueResponse.data.queue.length);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, [refetch]); // Re-fetch data when refetch changes

  // Update time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

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

  // Function to handle form submission in the modal
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/medical-record/appointments/getAppoinments", {
        params: { date: selectedDate },
      });

      // If appointments are fetched, show them in the modal
      if (response.data && response.data.length > 0) {
        setAppointments(response.data);
        setIsModalOpen(false);
        setIsAppointmentsModalOpen(true);
      } else {
        alert("No appointments found for the selected date.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments. Please try again later.");
    }
  };

  return (
    <div className="flex justify-between gap-10">
      {/* Date and Time Cards */}
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

      {/* Queue Count Card */}
      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Total Patients in Queue</h1>
          <h2 className="text-gray-700 text-sm">{queueCount}</h2>
        </div>
      </div>

      {/* Check Appointments Button */}
      <div
        className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg cursor-pointer"
        onClick={() => setIsModalOpen(true)} // Open modal on click
      >
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Check Appointments</h1>
        </div>
      </div>

      {/* Modal for selecting a date */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Select Appointment Date</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded-md w-full mb-4"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Submit
              </button>
              <button
                type="button"
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => setIsModalOpen(false)} // Close modal on cancel
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for displaying appointments */}
      {isAppointmentsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-3xl"> {/* Increased modal width */}
            <h2 className="text-lg font-semibold mb-4">Appointments for {selectedDate}</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="border px-4 py-2">#</th> {/* New # column */}
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">ID Number</th>
                  <th className="border px-4 py-2">Phone Number</th>
                  <th className="border px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td> {/* Serial number */}
                    <td className="border px-4 py-2">{appointment.name}</td>
                    <td className="border px-4 py-2">{appointment.idNumber}</td>
                    <td className="border px-4 py-2">{appointment.phoneNumber}</td>
                    <td className="border px-4 py-2">{appointment.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
              onClick={() => setIsAppointmentsModalOpen(false)} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardStarter;
