import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import BasicModal from "../../../component/Modal/BasicModel";
import UpdateModal from "../../../component/Modal/UpdateModal";
import CreatePatientForm from "../../../component/Patient/CreatePatientForm";
import UpdatePatientForm from "../../../component/Patient/UpdatePatientForm";
import {
  useDeletePatientMutation,
  useGetAllPatientQuery,
} from "../../../redux/api/patientAPI";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { getResponse } from "../../../utils/getResponst";
import type { TPatient } from "../../../types/User";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

export default function PatientManagement() {
  const { data: patients, isLoading } = useGetAllPatientQuery("", {
    refetchOnMountOrArgChange: true,
  });

  const { user } = useSelector((state: RootState) => state.auth);

  const [deletePatient] = useDeletePatientMutation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<TPatient | null>(null);
  const [searchText, setSearchText] = useState("");

  const filteredPatients = (patients?.data ?? []).filter((row: TPatient) => {
    const query = searchText.trim().toLowerCase();

    if (!query) return true;

    return [row.name, row.contactNumber, row.patientId].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(query),
    );
  });

  const handleEdit = (patient: TPatient) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deletePatient(id);
        getResponse(res);
      }
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    });
  };

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          bgcolor: "white",
          borderRadius: 3,
          display: "flex",
          gap: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>
          Patient Management
        </Typography>
        <Box className="flex-1">
          <TextField
            placeholder="Search by name or phone number or Patient Id"
            size="small"
            type="text"
            fullWidth
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Box>

        <BasicModal buttonLabel="Add Patient">
          <CreatePatientForm />
        </BasicModal>
      </Box>

      <Divider />

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Age</TableCell>
                  <TableCell align="left">Sex</TableCell>
                  <TableCell align="left">Contact Number</TableCell>
                  <TableCell align="left">Address</TableCell>
                  <TableCell align="left">Patient Id</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients.map((row: TPatient, index: number) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.age}</TableCell>
                    <TableCell align="left">{row.sex}</TableCell>
                    <TableCell align="left">{row.contactNumber}</TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                    <TableCell align="left">{row.patientId}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                        }}
                      >
                        <Link to={`${row.patientId}`}>
                          <Visibility
                            color="primary"
                            sx={{ cursor: "pointer" }}
                          />
                        </Link>
                        <Edit
                          color="primary"
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleEdit(row)}
                        />
                        {user?.role.includes("ADMIN") ||
                          (user?.role.includes("DOCTOR") && (
                            <Delete
                              color="error"
                              sx={{ cursor: "pointer" }}
                              onClick={() => handleDelete(row.id!)}
                            />
                          ))}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <UpdateModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
      >
        {selectedPatient && (
          <UpdatePatientForm
            data={selectedPatient}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </UpdateModal>
    </Box>
  );
}
