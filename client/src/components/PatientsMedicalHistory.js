import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useScrollShadow,
} from "@nextui-org/react";
import { medicalHistory } from "../data/PatientsMedicalHistory";
import { useState, useEffect } from "react";
import axios from "axios";

const PatientsMedicalHistory = () => {
  const [tableCotent, setTableContent] = useState([]);
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    
    axios.get(`http://localhost:5000/patients/email2id/${user.email}`)
      .then((response) => {
        const id = response.data.patientId;
        setPatientId(id);
        console.log("Patient ID:", id);
        return axios.get(`http://localhost:5000/medical-record/medicalhistory/${id}`);
      })
      .then((response) => {
        const data = response.data;
        const processedData = data.map((historyItem) => ({
          date: historyItem.date.slice(0, 10),
          docName: historyItem.docName,
        }));
        console.log("Processed Data:", processedData);
        setTableContent(processedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
      });
  }, []);

  const dayReportDownload = (d) => {
    const date = new Date(d);
    const payload = {
      date: date,
      patientId: patientId
    };
  
    axios.post("http://localhost:5000/report/day", payload, {
      responseType: 'blob' 
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      const link = document.createElement('a');
      link.href = url;
  
      const fileName = response.headers['content-disposition'] 
                        ? response.headers['content-disposition'].split('filename=')[1] 
                        : 'Day_Report.pdf';
                        
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
    })
    .catch(error => {
      console.error('Error downloading the day report:', error);
    });
  };
  
  return (
    <div>
      <div className="w-[800px] mt-2">
        <Table aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Doctor Name</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {tableCotent.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.docName}</TableCell>
                <TableCell>
                  <button className="bg-transparent border-2 p-1 rounded-md" onClick={() => {
                    dayReportDownload(item.date)
                  }}>Download</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default PatientsMedicalHistory;