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
import ClickShowMoreDoctor from "../modal/ClickShowMoreDoctor";
import EditDoctorModel from "../modal/EditDoctorModel";
import DeleteDoctorModel from "../modal/DeleteDoctorModel";
import { useGlobalRefetch } from "../store/store";
import EditlaboratoristModel from "../modal/EditlaboratoristModel";
import ClickShowMorelaboratorist from "../modal/ClickShowMorelaboratorist";
import DeletelaboratoristModel from "../modal/DeletelaboratoristModel";
import ClickShowMoreAttendant from "../modal/ClickShowMoreAttendant";
import EditAttendantModel from "../modal/EditAttendantModel";
import DeleteAttendantModel from "../modal/DeleteAttendantModel";

const AttendantStaff = () => {
  const [page, setPage] = useState(1);
  const [selectedAttendant, setSelectedAttendant] = useState(null);
  const [selectedAttendantId, setSelectedAttendantId] = useState(null);
  const [attendant, setAttendant] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const rowsPerPage = 6;
  const pages = Math.ceil(attendant.length / rowsPerPage);

  const { globalRefetch, setGlobalRefetch } = useGlobalRefetch();
  console.log(globalRefetch, "globalRefetch");
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return attendant?.slice(start, end);
  }, [page, attendant]);

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

  const handleShowMore = (attendant) => {
    setSelectedAttendant(attendant);
    openShowMore();
  };

  const handleEdit = (attendant) => {
    setSelectedAttendant(attendant);
    openEdit();
  };

  const handleDelete = (id) => {
    setSelectedAttendantId(id);
    openDelete();
    console.log(id, "id");
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth");
        const data = await res.json();
        const u = data.users;

        const attendant = u.filter((item) => item.role === "attendant");
        console.log(attendant);
        setAttendant(attendant);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
  }, [refetch, globalRefetch]);

  useEffect(() => {
    if (globalRefetch) {
      setGlobalRefetch(false);
    }
  }, [globalRefetch, setGlobalRefetch]);

  return (
    <div>
      <div className="flex justify-between p-2">
        <h1 className="text-center mt-2 font-semibold">Attendant members</h1>
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
            <TableColumn>Username</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>Phone Number</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody>
            {" "}
            {items.map(
              (item, index) =>
                item.role === "attendant" && (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.phoneNumber}</TableCell>
                    <TableCell className="flex gap-6">
                      <Tooltip content="Details">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <FaRegEye onClick={() => handleShowMore(item)} />
                        </span>
                      </Tooltip>
                      <Tooltip content="Edit member details">
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <FaUserEdit onClick={() => handleEdit(item)} />
                        </span>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete member">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <MdDeleteSweep
                            onClick={() => handleDelete(item._id)}
                          />
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
            )}{" "}
          </TableBody>
        </Table>
      </div>

      <ClickShowMoreAttendant
        isOpen={isShowMoreOpen}
        onOpenChange={onShowMoreChange}
        attendant={selectedAttendant}
      />
      <EditAttendantModel
        isOpen={isEditOpen}
        onOpenChange={onEditChange}
        selectedAttendant={selectedAttendant}
        setSelectedAttendant={setSelectedAttendant}
        setRefetch={setRefetch}
        refetch={refetch}
      />

      <DeleteAttendantModel
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteChange}
        selectedAttendantId={selectedAttendantId}
        setSelectedAttendantId={setSelectedAttendantId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default AttendantStaff;
