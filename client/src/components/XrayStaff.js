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
import ClickShowMoreXray from "../modal/ClickShowMoreXray";
import EditXrayModel from "../modal/EditXrayModel";
import DeleteXrayModel from "../modal/DeleteXrayModel";

const XrayStaff = () => {
  const [page, setPage] = useState(1);
  const [selectedXray, setSelectedXray] = useState(null);
  const [selectedXrayId, setSelectedXrayId] = useState(null);
  const [xray, setXray] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const rowsPerPage = 6;
  const pages = Math.ceil(xray.length / rowsPerPage);

  const { globalRefetch, setGlobalRefetch } = useGlobalRefetch();
  console.log(globalRefetch, "globalRefetch");
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return xray?.slice(start, end);
  }, [page, xray]);

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

  const handleShowMore = (xray) => {
    setSelectedXray(xray);
    openShowMore();
  };

  const handleEdit = (xray) => {
    setSelectedXray(xray);
    openEdit();
  };

  const handleDelete = (id) => {
    setSelectedXrayId(id);
    openDelete();
    console.log(id, "id");
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth");
        const data = await res.json();
        const u = data.users;

        const xray = u.filter((item) => item.role === "rediologist");
        console.log(xray);
        setXray(xray);
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
        <h1 className="text-center mt-2 font-semibold">X-Ray Staff List</h1>
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
            <TableColumn>Ac tion</TableColumn>
          </TableHeader>
          <TableBody>
            {" "}
            {items.map(
              (item, index) =>
                item.role === "rediologist" && (
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
                      <Tooltip content="Edit member">
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

      <ClickShowMoreXray
        isOpen={isShowMoreOpen}
        onOpenChange={onShowMoreChange}
        xray={selectedXray}
      />
      <EditXrayModel
        isOpen={isEditOpen}
        onOpenChange={onEditChange}
        selectedXray={selectedXray}
        setSelectedXray={setSelectedXray}
        setRefetch={setRefetch}
        refetch={refetch}
      />

      <DeleteXrayModel
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteChange}
        selectedXrayId={selectedXrayId}
        setSelectedXrayId={setSelectedXrayId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default XrayStaff;
