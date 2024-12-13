import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import AddPatientModel from "../modal/AddPatientModal";
import ClickShowMore from "../modal/ClickShowMore";
import EditPatientModel from "../modal/EditPatientModal";
import { useEffect, useMemo, useState } from "react";
import { Patient } from "../data/patients";
import DeletePatientModel from "../modal/DeletePatientModel";

const PatientsListAdmin = () => {
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [Patient, setPatient] = useState([]);
  const rowsPerPage = 6;
  const pages = Math.ceil(Patient.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return Patient.slice(start, end);
  }, [page, Patient]);

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalChange,
  } = useDisclosure();

  const {
    isOpen: isShowMoreOpen,
    onOpen: openShowMore,
    onOpenChange: onShowMoreChange,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onOpenChange: onEditChange,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: openDelete,
    onOpenChange: onDeleteChange,
  } = useDisclosure();

  const handleShowMore = (patient) => {
    setSelectedPatient(patient);
    openShowMore();
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    openEdit();
  };

  const handleDelete = (id) => {
    setSelectedPatientId(id);
    openDelete();
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/patients");
        const data = await res.json();
        setPatient(data.patients);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
  }, []);
  return (
    <div>
      <div className="flex justify-between p-2">
        <h1 className="text-center mt-2 font-semibold">Patients List</h1>
      </div>
      <div className="w-[1000px] mt-2">
        <Table
          aria-label="Example static collection table"
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
            <TableColumn>Id</TableColumn>
            <TableColumn>Id Number</TableColumn>
            <TableColumn>First Name</TableColumn>
            <TableColumn>Last Name</TableColumn>
            <TableColumn>Phone Number</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.idNumber}</TableCell>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddPatientModel isOpen={isModalOpen} onOpenChange={onModalChange} />
      <ClickShowMore
        isOpen={isShowMoreOpen}
        onOpenChange={onShowMoreChange}
        patient={selectedPatient}
      />
      <EditPatientModel
        isOpen={isEditOpen}
        onOpenChange={onEditChange}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
      />

      <DeletePatientModel
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteChange}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
      />
    </div>
  );
};

export default PatientsListAdmin;
