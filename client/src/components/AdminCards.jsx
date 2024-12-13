import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";

const CardStarter = () => {
  const [date, setDate] = useState(getDateTime());
  const [time, setTime] = useState(getTime());
  const [patientsCount, setPatientsCount] = useState(0);  // State for total patients
  const [staffCount, setStaffCount] = useState(0);  // State for total staff members

  // Fetch total patients and staff count when the component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch total patients count
        const patientsResponse = await axios.get("http://localhost:5000/patients");  // Adjust URL if necessary
        setPatientsCount(patientsResponse.data.patients.length);

        // Fetch total staff count (assuming you have an endpoint for staff)
        const staffResponse = await axios.get("http://localhost:5000/auth");  // Adjust URL if necessary
        setStaffCount(staffResponse.data.users.length);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

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
          <h1 className="font-semibold text-sm">Total Patients</h1>
          <h2 className="text-gray-700 text-sm">{patientsCount}</h2>  {/* Display patient count */}
        </div>
      </div>
      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Total staff members</h1>
          <h2 className="text-gray-700 text-sm">{staffCount}</h2>  {/* Display staff count */}
        </div>
      </div>
    </div>
  );
};

export default CardStarter;
