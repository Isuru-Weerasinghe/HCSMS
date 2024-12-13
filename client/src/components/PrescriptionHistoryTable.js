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
  Button,
  Input,
} from "@nextui-org/react";
import { FaRegEye, FaUserEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md"; // Import the delete icon
import { useMemo, useState, useEffect } from "react";
import axios from "axios"; // Import Axios for making API calls

const PrescriptionHistoryTable = ({ patientId, triggerRefetch }) => {
  const [page, setPage] = useState(1);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [newPrescription, setNewPrescription] = useState(""); // State to store updated prescription
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // Confirm delete modal
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false); // Confirm update modal
  const rowsPerPage = 6;

  useEffect(() => {
    // Fetch prescriptions based on patientId
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/medical-record/prescriptionhistory/${patientId}`
        );
        const sortedPrescriptions = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ); // Sort by date (newest first)
        setPrescriptions(sortedPrescriptions);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId,triggerRefetch]);

  const pages = Math.ceil(prescriptions.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return prescriptions.slice(start, end);
  }, [page, prescriptions]);

  const handleShowMore = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrescription(null);
  };

  // Edit Prescription Handler
  const handleEditPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setNewPrescription(prescription.prescription); // Preload the current prescription into the input
    setIsEditModalOpen(true);
  };

  const handleUpdatePrescription = async () => {
    try {
      await axios.put(
        `http://localhost:5000/medical-record/update/prescription/${selectedPrescription._id}`,
        { prescription: newPrescription }
      );
      // Fetch updated prescriptions after successful update
      setPrescriptions((prev) =>
        prev.map((item) =>
          item._id === selectedPrescription._id
            ? { ...item, prescription: newPrescription }
            : item
        )
      );
      setIsEditModalOpen(false);
      setIsConfirmUpdateOpen(false); // Close confirm modal
      setSelectedPrescription(null);
    } catch (error) {
      console.error("Error updating prescription:", error);
    }
  };

  // Delete Prescription Handler
  const handleDeletePrescription = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/medical-record/delete/prescription/${selectedPrescription._id}`
      );
      // Update the state to remove the deleted prescription
      setPrescriptions((prev) =>
        prev.filter((item) => item._id !== selectedPrescription._id)
      );
      setIsConfirmDeleteOpen(false); // Close confirm modal
      setSelectedPrescription(null);
    } catch (error) {
      console.error("Error deleting prescription:", error);
    }
  };

  return (
    <div className="w-[1000px] mt-2">
      <div className="flex justify-between p-2">
        <h1 className="text-center mt-2 font-semibold">Prescription History</h1>
      </div>
      <Table
        aria-label="Prescription history table"
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
          <TableColumn>Date of Issue</TableColumn>
          <TableColumn>Time</TableColumn>
          <TableColumn>Issued by Dr</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item._id}>
              <TableCell>{index + 1 + (page - 1) * rowsPerPage}</TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.date).toLocaleTimeString()}</TableCell>
              <TableCell>{item.docName}</TableCell>
              <TableCell className="flex gap-6">
                <Tooltip content="View Prescription">
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => handleShowMore(item)}
                  >
                    <FaRegEye />
                  </span>
                </Tooltip>
                <Tooltip content="Edit Prescription">
                  <span
                    className="text-lg text-blue-400 cursor-pointer active:opacity-50"
                    onClick={() => handleEditPrescription(item)}
                  >
                    <FaUserEdit />
                  </span>
                </Tooltip>
                <Tooltip content="Delete Prescription">
                  <span
                    className="text-lg text-red-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      setSelectedPrescription(item);
                      setIsConfirmDeleteOpen(true);
                    }}
                  >
                    <MdDeleteSweep />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Prescription View Modal */}
      <Modal isOpen={isModalOpen} onOpenChange={handleCloseModal}>
        <ModalContent>
          {selectedPrescription && (
            <ModalHeader>
              Prescription List on{" "}
              {new Date(selectedPrescription.date).toLocaleDateString()}{" "}
              {new Date(selectedPrescription.date).toLocaleTimeString()}
            </ModalHeader>
          )}
          <ModalBody>
            {selectedPrescription ? (
              <div>
                <ul>
                  {selectedPrescription.prescription
                    .split(",")
                    .map((item, index) => (
                      <li key={index}>{item.trim()}</li> // Trim to remove extra spaces
                    ))}
                </ul>
              </div>
            ) : (
              <p>No prescription details available.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Prescription Edit Modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(false)}>
        <ModalContent>
          {selectedPrescription && (
            <ModalHeader>
              Edit Prescription -{" "}
              {new Date(selectedPrescription.date).toLocaleDateString()}
            </ModalHeader>
          )}
          <ModalBody>
            <Input
              value={newPrescription}
              onChange={(e) => setNewPrescription(e.target.value)}
              placeholder="Update prescription"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setIsConfirmUpdateOpen(true)} // Open confirmation modal
            >
              Update
            </Button>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal isOpen={isConfirmDeleteOpen} onOpenChange={() => setIsConfirmDeleteOpen(false)}>
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this prescription?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleDeletePrescription}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Update Modal */}
      <Modal isOpen={isConfirmUpdateOpen} onOpenChange={() => setIsConfirmUpdateOpen(false)}>
        <ModalContent>
          <ModalHeader>Confirm Update</ModalHeader>
          <ModalBody>
            Are you sure you want to update this prescription?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={() => setIsConfirmUpdateOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleUpdatePrescription}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PrescriptionHistoryTable;
