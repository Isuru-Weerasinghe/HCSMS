import React, { useEffect, useState } from "react";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import axios from "axios";

const CardStarter = (refetch) => {
  const [date, setDate] = useState(getDateTime());
  const [time, setTime] = useState(getTime());
  const [patientsCount, setPatientsCount] = useState(0); // State for total patients
  const [registeredTodayCount, setRegisteredTodayCount] = useState(0); // State for patients registered today

  // Fetch total patients, staff count, and today's registered patients when the component mounts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const patientsResponse = await axios.get("http://localhost:5000/patients");
        setPatientsCount(patientsResponse.data.patients.length);
  
        // Fetch count of registered patients today without params
        const registeredTodayResponse = await axios.get("http://localhost:5000/medical-record/registrations/today");
        setRegisteredTodayCount(registeredTodayResponse.data.count);
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
          <h1 className="font-semibold text-sm">Total Patients in Clinic</h1>
          <h2 className="text-gray-700 text-sm">{patientsCount}</h2>
        </div>
      </div>
      <div className="mt-5 flex px-10 py-3 items-center justify-center gap-5 bg-slate-200 rounded-lg">
        <FaUsers size={30} className="text-blue-500" />
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-sm">Patients Registered Today</h1>
          <h2 className="text-gray-700 text-sm">{registeredTodayCount}</h2> 
        </div>
      </div>
    </div>
  );
};

export default CardStarter;
