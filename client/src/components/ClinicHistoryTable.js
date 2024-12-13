import { 
  Pagination, 
  Table, 
  TableBody, 
  TableCell, 
  TableColumn, 
  TableHeader, 
  TableRow, 
  Tooltip, 
  Modal, 
  ModalBody, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Textarea, 
  Button, 
  Input 
} from "@nextui-org/react";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AddMedicaleRecordModal from "../modal/AddMedicaleRecordModal";

const ClinicHistoryTable = ({ patientId, triggerRefetch }) => {
  const [page, setPage] = useState(1);
  const [clinicHistory, setClinicHistory] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null); // For editing
  const [addRecordVisible, setAddRecordVisible] = useState(false); // Add record modal
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false); // Delete confirm modal
  const [recordToDelete, setRecordToDelete] = useState(null); // Record to delete
  const [updateConfirmVisible, setUpdateConfirmVisible] = useState(false); // Update confirm modal
  const [updatedDescription, setUpdatedDescription] = useState(""); // Store updated description

  const rowsPerPage = 6;

  // Fetch clinic history
  const fetchClinicHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/medical-record/medicalhistory/${patientId}`
      );
      const sortedHistory = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setClinicHistory(sortedHistory);
    } catch (error) {
      console.error("Error fetching clinic history:", error);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchClinicHistory();
    }
  }, [patientId, triggerRefetch]);

  const pages = Math.ceil(clinicHistory.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return clinicHistory.slice(start, end);
  }, [page, clinicHistory]);

  const handleShowMore = (record) => {
    setVisible(true);
    setSelectedRecord(record);
  };

  const closeHandler = () => {
    setVisible(false);
    setSelectedRecord(null);
  };

  const handleDeleteClick = (recordId) => {
    setRecordToDelete(recordId);
    setDeleteConfirmVisible(true);
  };

  const handleDeleteRecord = async () => {
    if (recordToDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/medical-record/deleteMedicalRecord/${recordToDelete}`
        );
        setDeleteConfirmVisible(false);
        fetchClinicHistory(); // Fetch updated history after deletion
      } catch (error) {
        console.error("Error deleting medical record:", error);
      }
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record); // Set the record to be edited
    setUpdatedDescription(record.description); // Initialize updated description
    setUpdateConfirmVisible(true); // Show the update confirmation modal
  };

  const handleUpdateRecord = async () => {
    if (editingRecord) {
      try {
        const updatedRecord = { ...editingRecord, description: updatedDescription };
        await axios.put(`http://localhost:5000/medical-record/updateMedicalRecord/${editingRecord._id}`, updatedRecord);
        setEditingRecord(null);
        setUpdateConfirmVisible(false); // Close the confirmation modal
        fetchClinicHistory(); // Refetch data after updating
      } catch (error) {
        console.error("Error updating medical record:", error);
      }
    }
  };

  return (
    <div className="w-[1000px] mt-2">
      <div className="flex justify-between p-2">
        <h1 className="text-center mt-2 font-semibold">Patient Medical records</h1>
      </div>
      <Table
        aria-label="Patient clinic history table"
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
          <TableColumn>Date of Visit</TableColumn>
          <TableColumn>Time of Visit</TableColumn>
          <TableColumn>Responsible Doctor</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.date).toLocaleTimeString()}</TableCell>
              <TableCell>{item.docName}</TableCell>
              <TableCell>
                {item.description.slice(0, 50)}
                {item.description.length > 50 ? "..." : ""}
              </TableCell>
              <TableCell className="flex gap-6">
                <Tooltip content="Details">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <FaRegEye onClick={() => handleShowMore(item)} />
                  </span>
                </Tooltip>
                <Tooltip content="Edit">
                  <span className="text-lg text-blue-400 cursor-pointer active:opacity-50">
                    <FaUserEdit onClick={() => handleEditRecord(item)} />
                  </span>
                </Tooltip>
                <Tooltip content="Delete">
                  <span className="text-lg text-red-400 cursor-pointer active:opacity-50">
                    <MdDeleteSweep onClick={() => handleDeleteClick(item._id)} />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for displaying detailed information */}
      {selectedRecord && (
        <Modal isOpen={visible} onClose={closeHandler} size="lg">
          <ModalContent>
            <ModalHeader>
              Details for {new Date(selectedRecord.date).toLocaleDateString()}
            </ModalHeader>
            <ModalBody>
              <Textarea
                readOnly
                label="Medical Record Description"
                value={selectedRecord.description}
                minRows={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button auto flat color="error" onClick={closeHandler}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Modal for editing a medical record with confirmation */}
      {editingRecord && (
        <Modal isOpen={updateConfirmVisible} onClose={() => setUpdateConfirmVisible(false)}>
          <ModalContent>
            <ModalHeader>Edit Medical Record Description</ModalHeader>
            <ModalBody>
              <Input
                label="Date of Visit"
                value={new Date(editingRecord.date).toLocaleDateString()}
                readOnly
              />
              <Input
                label="Time of Visit"
                value={new Date(editingRecord.date).toLocaleTimeString()}
                readOnly
              />
              <Input
                label="Responsible Doctor"
                value={editingRecord.docName}
                readOnly
              />
              <Textarea
                label="Description"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                minRows={3}
              />
            </ModalBody>
            <ModalFooter>
              <Button auto flat onClick={() => setUpdateConfirmVisible(false)}>
                Cancel
              </Button>
              <Button auto onClick={handleUpdateRecord}>
                Confirm Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Confirm delete modal */}
      {deleteConfirmVisible && (
        <Modal isOpen={deleteConfirmVisible} onClose={() => setDeleteConfirmVisible(false)}>
          <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
              Are you sure you want to delete this medical record?
            </ModalBody>
            <ModalFooter>
              <Button auto flat onClick={() => setDeleteConfirmVisible(false)}>
                Cancel
              </Button>
              <Button auto color="error" onClick={handleDeleteRecord}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default ClinicHistoryTable;
