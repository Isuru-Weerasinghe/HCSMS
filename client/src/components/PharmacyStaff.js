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
import ClickShowMorePharmacy from "../modal/ClickShowMorePharmacy";
import EditPharmacyModel from "../modal/EditPharmacyModel";
import DeletePharmacyModel from "../modal/DeletePharmacyModel";

const PharmacyStaff = () => {
  const [page, setPage] = useState(1);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(null);
  const [pharmacy, setPharmacy] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const rowsPerPage = 6;
  const pages = Math.ceil(pharmacy.length / rowsPerPage);

  const { globalRefetch, setGlobalRefetch } = useGlobalRefetch();
  console.log(globalRefetch, "globalRefetch");
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return pharmacy?.slice(start, end);
  }, [page, pharmacy]);

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

  const handleShowMore = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    openShowMore();
  };

  const handleEdit = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    openEdit();
  };

  const handleDelete = (id) => {
    setSelectedPharmacyId(id);
    openDelete();
    console.log(id, "id");
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth");
        const data = await res.json();
        const u = data.users;

        const Pharmacy = u.filter((item) => item.role === "pharmacist");
        console.log(Pharmacy);
        setPharmacy(Pharmacy);
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
        <h1 className="text-center mt-2 font-semibold">Pharmacy Staff members</h1>
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
                item.role === "pharmacist" && (
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

      <ClickShowMorePharmacy
        isOpen={isShowMoreOpen}
        onOpenChange={onShowMoreChange}
        pharmacy={selectedPharmacy}
      />
      <EditPharmacyModel
        isOpen={isEditOpen}
        onOpenChange={onEditChange}
        selectedLaboraty={selectedPharmacy}
        setSelectedPharmacy={setSelectedPharmacy}
        setRefetch={setRefetch}
        refetch={refetch}
      />

      <DeletePharmacyModel
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteChange}
        selectedPharmacyId={selectedPharmacyId}
        setSelectedPharmacyId={setSelectedPharmacyId}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default PharmacyStaff;
