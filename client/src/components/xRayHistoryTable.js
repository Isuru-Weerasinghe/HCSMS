import {
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    Button,
  } from "@nextui-org/react";
  import { useEffect, useMemo, useState } from "react";
  import axios from "axios";
  
  const XrayHistoryTable = ({ patientId,triggerRefetch }) => {
    const [page, setPage] = useState(1);
    const [xrayHistory, setXrayHistory] = useState([]);
    const rowsPerPage = 6;
  
    // Fetch X-ray history based on patientId
    useEffect(() => {
      const fetchXrayHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/medical-record/xray/${patientId}`
          );
          const sortedHistory = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setXrayHistory(sortedHistory);
        } catch (error) {
          console.error("Error fetching X-ray history:", error);
        }
      };
  
      if (patientId) {
        fetchXrayHistory();
      }
    }, [patientId,triggerRefetch]);
  
    const pages = Math.ceil(xrayHistory.length / rowsPerPage);
  
    const items = useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return xrayHistory.slice(start, end);
    }, [page, xrayHistory]);
  
    return (
      <div className="w-[1000px] mt-2">
        <div className="flex justify-between p-2">
          <h1 className="text-center mt-2 font-semibold">X-ray History</h1>
        </div>
        <Table
          aria-label="X-ray history table"
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
            <TableColumn>#</TableColumn>
            <TableColumn>Issued By</TableColumn>
            <TableColumn>Date of Issue</TableColumn>
            <TableColumn>Time</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Delivered</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>Dr. {item.xrayIssued}</TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.date).toLocaleTimeString()}</TableCell>
                <TableCell>{item.xray.slice(0, 50)}{item.xray.length > 50 ? "..." : ""}</TableCell>
                <TableCell>{item.delivered ? "Delivered" : "Not Delivered"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default XrayHistoryTable;
  