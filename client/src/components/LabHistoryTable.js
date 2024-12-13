import { 
    Pagination, 
    Table, 
    TableBody, 
    TableCell, 
    TableColumn, 
    TableHeader, 
    TableRow, 
    Tooltip, 
    Button 
  } from "@nextui-org/react";
  import { useEffect, useMemo, useState } from "react";
  import axios from "axios";
  
  const LabHistoryTable = ({ patientId, triggerRefetch }) => {
    const [page, setPage] = useState(1);
    const [labHistory, setLabHistory] = useState([]);
    const rowsPerPage = 6;
  
    // Fetch Lab history based on patientId
    useEffect(() => {
      const fetchLabHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/reports/lab-results/${patientId}`
          );
          const sortedHistory = response.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setLabHistory(sortedHistory);
        } catch (error) {
          console.error("Error fetching lab history:", error);
        }
      };
  
      if (patientId) {
        fetchLabHistory();
      }
    }, [patientId,triggerRefetch]);
  
    const pages = Math.ceil(labHistory.length / rowsPerPage);
  
    const items = useMemo(() => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      return labHistory.slice(start, end);
    }, [page, labHistory]);
  
    return (
      <div className="w-[1000px] mt-2">
        <div className="flex justify-between p-2">
          <h1 className="text-center mt-2 font-semibold">Lab History</h1>
        </div>
        <Table
          aria-label="Lab history table"
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
            <TableColumn>Time of Issue</TableColumn>
            <TableColumn>Report Description</TableColumn>
            <TableColumn>Delivered</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>Dr. {item.reportRequested}</TableCell>
                <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.date).toLocaleTimeString()}</TableCell>
                <TableCell>
                  {item.report_desc.slice(0, 50)}
                  {item.report_desc.length > 50 ? "..." : ""}
                </TableCell>
                <TableCell>{item.delivered ? "Delivered" : "Not Delivered"}</TableCell>
                <TableCell>
                  <Tooltip content="Read Lab Result">
                    <Button
                      size="sm"
                      color="primary"
                      onPress={() => window.open(`http://localhost:5000/${item.pdfUrl}`, "_blank")}
                    >
                      Read
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default LabHistoryTable;
  