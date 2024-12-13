import {   
  Button,   
  Input,   
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
import LabCards from "../components/LabCards"
import ScanQrModalLaboratary from "../modal/ScanQrModalLaboratary"; 
import { useEffect, useMemo, useState } from "react"; 
import toast from "react-hot-toast"; 
import axios from "axios";


const Laboratory = () => {   
  const [page, setPage] = useState(1);   
  const [datac, setData] = useState(null); // Store patient data   
  const [lab, setLab] = useState([]); // Store lab reports   
  const [refetch, setRefetch] = useState(false); // Control refetching   
  const rowsPerPage = 6; // Set rows per page for the table   
  const pages = Math.ceil(lab.length / rowsPerPage); // Total number of pages   
  const [file, setFile] = useState(null); // Store uploaded file   
  const [age, setAge] = useState(''); // Patient age   

  // Function to handle file change   
  const fileChange = (e) => {     
    const selectedFile = e.target.files[0];     
    setFile(selectedFile);   
  };   

  // Paginate lab items   
  const items = useMemo(() => {     
    const start = (page - 1) * rowsPerPage;     
    const end = start + rowsPerPage;     
    return lab.slice(start, end);   
  }, [page, lab]);   

  // Modal handling   
  const { isOpen: isModalOpen, onOpen: openModal, onOpenChange: onModalChange } = useDisclosure();   

  // Fetch lab report based on the selected patient   
  useEffect(() => {     
    const fetchReport = async () => {       
      if (datac) {         
        try {           
          const response = await fetch(`http://localhost:5000/medical-record/lab/${datac?._id}`, {             
            headers: { "Content-Type": "application/json" },           
          });           

          if (response.status === 404) {             
            toast.error("Report not found.");           
          } else if (response.status === 200) {             
            const data = await response.json();             
            setLab(data); // Set lab reports           
          }         
        } catch (error) {           
          console.error("Error retrieving report:", error);           
          toast.error("Failed to retrieve report.");         
        }       
      }     
    };     
    fetchReport();   
  }, [datac, refetch]);   

  // Upload file and update lab report   
  const onSubmit = async () => {     
    if (!file) {       
      toast.error("Please select a file before uploading.");       
      return;     
    }      

    if (!datac) {       
      toast.error("No patient data available.");       
      return;     
    }      

    // Prepare FormData     
    const formData = new FormData();     
    formData.append("file", file);     
    formData.append("labId", lab[lab.length - 1]?._id); // Assuming datac._id is the patient ID  
    formData.append("delivered", true); // Mark as delivered
    formData.append("firstName", datac.firstName); // Append additional fields
    formData.append("lastName", datac.lastName);
    formData.append("phoneNumber", datac.phoneNumber);

    try {       
      const response = await axios.post("http://localhost:5000/reports/upload", formData, {         
        headers: {           
          "Content-Type": "multipart/form-data",         
        },
               
      });       

      if (response.status === 200) {         
        toast.success("Report uploaded successfully");         
        setRefetch(!refetch); // Trigger refetch to update data         
        setFile(null);       
      }     
    } catch (error) {       
      console.error("Error uploading file:", error);       
      toast.error("An error occurred during file upload. Please try again.");     
    }   
  };   

  // Calculate patient's age based on date of birth   
  useEffect(() => {     
    if (datac && datac.dob) {       
      const calculatedAge = calculateAge(new Date(datac.dob));       
      setAge(calculatedAge);     
    }   
  }, [datac]);   

  const calculateAge = (birthdate) => {     
    const today = new Date();     
    let age = today.getFullYear() - birthdate.getFullYear();     
    const monthDiff = today.getMonth() - birthdate.getMonth();      

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {       
      age--;     
    }     
    return age;   
  };   

  return (     
    <Layout> 
    <div className="">
          <LabCards refetch={refetch} />
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

      {/* Patient Details Section */}
      <div className="flex flex-row mt-10">         
        <div className="flex-1 px-5">           
          {datac ? (             
            <h1 className="text-xl font-semibold text-center mt-1">Patient Details</h1>           
          ) : (             
            <div className="border rounded-lg h-60">               
              <h1 className="text-2xl font-semibold text-center mt-5">Patient Details</h1>               
              <h1 className="text-red-500 text-sm mt-10 text-center">No patient data found. Please scan a QR code.</h1>             
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
                  <div className="text-blue-500">{datac.firstName + " " + datac.lastName}</div>                   
                  <div className="text-blue-500">{age} years</div>                   
                  <div className="text-blue-500">{datac.idNumber}</div>                   
                  <div className="text-blue-500">{new Date(datac.dob).toLocaleDateString()}</div>                   
                  <div className="text-blue-500">{datac.phoneNumber}</div>                   
                  <div className="text-blue-500">{datac.email}</div>                   
                  <div className="text-blue-500">{datac.address}</div>                 
                </div>               
              </div>             
            )}           
          </div> 
        </div>          

        {/* Lab Report Details Section */}         
        <div className="flex-1 px-5">           
          {lab.length > 0 ? (             
            <h1 className="text-xl font-semibold text-center mt-1">Test Request Details</h1>           
          ) : (             
            <div className="border rounded-lg h-60">               
              <h1 className="text-2xl font-semibold text-center mt-5">Lab Report Details</h1>               
              <h1 className="text-red-500 text-sm mt-10 text-center">Not available</h1>             
            </div>           
          )}           
          <div className="flex mt-2 items-center justify-center">             
            {lab.length > 0 && (               
              <div className="flex w-[520px] gap-10 p-4 rounded-lg border items-center">                 
                <div className="flex flex-col gap-2 ml-10">                   
                  <h1>Issued by Dr.</h1>                   
                  <h1>Issued date:</h1>                   
                  <h1>Description:</h1>                                   
                </div>                 
                <div className="flex flex-col gap-2">                   
                  <div className="text-blue-500">{lab[lab.length - 1]?.reportRequested}</div>                   
                  <div className="text-blue-500">{new Date(lab[lab.length - 1]?.date).toLocaleDateString()}</div>                   
                  <div className="text-blue-500">{lab[lab.length - 1]?.report_desc}</div>                   
                                  
                </div>               
              </div>             
            )}           
          </div>            

          {/* File Upload Section */}           
          <div className="ml-[120px] gap-2 flex justify-center mt-10 flex-col w-[550px]">             
            <input               
              type="file"               
              accept=".pdf"               
              placeholder="Enter Lab Report"               
              onChange={fileChange}               
              className="p-2 border-2 border-gray-300 rounded-lg cursor-pointer"             
            />             
            <Button onClick={onSubmit} color="danger">               
              Upload             
            </Button>   
                    
          </div>         
        </div>       
      </div>       

      {/* Table Section */}       
      <div className="w-full flex items-center justify-center mt-16">         
        <div className="w-[1000px] mt-2">           
          <Table             
            aria-label="Lab Reports Table"             
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
                <TableColumn>#</TableColumn> {/* Serial number */}
                <TableColumn>Requested By (Doctor Name)</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Time</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Action</TableColumn>
            </TableHeader>

            <TableBody>
                {items.map((item, index) => (
                    <TableRow key={index}>
                        {/* Serial number */}
                        <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell> 

                        {/* Requested by (Doctor's Name) */}
                        <TableCell>{item.reportRequested}</TableCell> 

                        {/* Date */}
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>

                        {/* Time */}
                        <TableCell>{new Date(item.date).toLocaleTimeString()}</TableCell> 

                        {/* Description */}
                        <TableCell>{item.report_desc}</TableCell> 

                        {/* View Report */}
                        <TableCell>
                            {item.pdfUrl ? (
                                <a
                                    href={`http://localhost:5000/${item.pdfUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500"
                                >
                                    View Report
                                </a>
                            ) : (
                                "No report available"
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
       
          </Table>         
        </div>       
      </div>       

      {/* Modal for Scanning */}       
      <ScanQrModalLaboratary isOpen={isModalOpen} onOpenChange={onModalChange} setData={setData} />     
    </Layout>   
  ); 
};  

export default Laboratory;
