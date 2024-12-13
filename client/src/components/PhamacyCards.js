import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";

const CardStarter = ({ refetch }) => {
  const [date, setDate] = useState(getDateTime());
  const [time, setTime] = useState(getTime());
  const [patientsCount, setPatientsCount] = useState(0); // State for total patients
  const [queueCount, setQueueCount] = useState(0); // State for total patients in queue
  const [prescriptionsCount, setPrescriptionsCount] = useState(0); // State for total prescriptions

  // Fetch total patients, queue count, and today's prescriptions count, now dependent on refetch prop
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch total patients count
        const patientsResponse = await axios.get("http://localhost:5000/patients");
        setPatientsCount(patientsResponse.data.patients.length);

        // Fetch total queue count
        const queueResponse = await axios.get("http://localhost:5000/medical-record/queue/get");
        setQueueCount(queueResponse.data.queue.length);

        // Fetch total prescriptions count for today
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const prescriptionsResponse = await axios.get("http://localhost:5000/medical-record/prescriptions/today", {
          params: {
            start: startOfDay.toISOString(),
            end: endOfDay.toISOString(),
          },
        });

        setPrescriptionsCount(prescriptionsResponse.data.count); // Assuming the count is returned
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
          <h1 className="font-semibold text-sm">Total Prescriptions issued Today</h1>
          <h2 className="text-gray-700 text-sm">{prescriptionsCount}</h2> {/* Display today's prescriptions */}
        </div>
      </div>
      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Total Patients in Queue</h1>
          <h2 className="text-gray-700 text-sm">{queueCount}</h2> {/* Display patients in queue */}
        </div>
      </div>
    </div>
  );
};

export default CardStarter;
