import { Box, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import BasicModal from "../../../component/Modal/BasicModel";
import UpdateModal from "../../../component/Modal/UpdateModal";
import CreatePatientForm from "../../../component/Patient/CreatePatientForm";
import UpdatePatientForm from "../../../component/Patient/UpdatePatientForm";
import { useDeletePatientMutation, useGetAllPatientQuery } from "../../../redux/api/patientAPI";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { getResponse } from "../../../utils/getResponst";
import type { TPatient } from "../../../types/User";
import { Link } from "react-router";

export default function PatientManagement() {
  const { data: patients, isLoading } = useGetAllPatientQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deletePatient] = useDeletePatientMutation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<TPatient | null>(null);

  const handleEdit = (patient: TPatient) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      const res = await deletePatient(id);
      getResponse(res);
    }
  };

  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Patient Management</Typography>

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
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients?.data?.map((row: TPatient, index: number) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.age}</TableCell>
                    <TableCell align="left">{row.sex}</TableCell>
                    <TableCell align="left">{row.contactNumber}</TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
                        <Link to={`${row.id}`}>
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
                        <Delete
                          color="error"
                          sx={{ cursor: "pointer" }}
                          onClick={() => handleDelete(row.id!)}
                        />
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
