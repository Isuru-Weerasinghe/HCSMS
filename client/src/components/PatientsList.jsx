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
  Pagination 
} from "@nextui-org/react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import AddPatientModel from "../modal/AddPatientModal";
import ClickShowMore from "../modal/ClickShowMore";
import EditPatientModel from "../modal/EditPatientModal";
import { useEffect, useMemo, useState } from "react";
import DeletePatientModel from "../modal/DeletePatientModel";

const PatientsList = ({ setRefetchRegistrarCards }) => {
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [Patient, setPatient] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [refetchsss, setRefetchsss] = useState(false);

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
    onOpenChange: onModalChange 
  } = useDisclosure();

  const { 
    isOpen: isShowMoreOpen, 
    onOpen: openShowMore, 
    onOpenChange: onShowMoreChange 
  } = useDisclosure();

  const { 
    isOpen: isEditOpen, 
    onOpen: openEdit, 
    onOpenChange: onEditChange 
  } = useDisclosure();

  const { 
    isOpen: isDeleteOpen, 
    onOpen: openDelete, 
    onOpenChange: onDeleteChange 
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
  }, [refetch, refetchsss]);

  // Trigger refetch of RegistrarCards after patient add or delete
  useEffect(() => {
    setRefetchRegistrarCards(prev => !prev);
  }, );

  return (
    <div>
      <div className="flex justify-between p-2">
        <h1 className="text-center mt-2 font-semibold">Patients List</h1>
        <Button onPress={openModal} color="primary">
          Add Patient
        </Button>
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
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.idNumber}</TableCell>
                <TableCell>{item.firstName}</TableCell>
                <TableCell>{item.lastName}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                <TableCell className="flex gap-6">
                  <Tooltip content="Details">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <FaRegEye onClick={() => handleShowMore(item)} />
                    </span>
                  </Tooltip>
                  <Tooltip content="Edit patient">
                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                      <FaUserEdit onClick={() => handleEdit(item)} />
                    </span>
                  </Tooltip>
                  <Tooltip color="danger" content="Delete patient">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <MdDeleteSweep onClick={() => handleDelete(item._id)} />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddPatientModel
        isOpen={isModalOpen}
        setRefetch={setRefetch}
        onOpenChange={onModalChange}
      />
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
        setRefetch={setRefetch}
      />
      <DeletePatientModel
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteChange}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        setRefetch={setRefetchsss}
      />
    </div>
  );
};

export default PatientsList;
