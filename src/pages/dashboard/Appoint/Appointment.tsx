import { Box, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CreateAppointmentForm from "../../../component/Appointment/CreateAppointmentForm";
import UpdateAppointmentForm from "../../../component/Appointment/UpdateAppointmentForm";
import BasicModal from "../../../component/Modal/BasicModel";
import UpdateModal from "../../../component/Modal/UpdateModal";
import { useDeleteAppointmentMutation, useGetAllAppointmentQuery } from "../../../redux/api/appointment";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { getResponse } from "../../../utils/getResponst";
import type { TAppointment } from "../../../types/User";
import { Link } from "react-router";

export default function AppointmentManagement() {
    const { data: appointments } = useGetAllAppointmentQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [deleteAppointment] = useDeleteAppointmentMutation();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

    const handleEdit = (id: number) => {
        setSelectedAppointmentId(id);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            const res = await deleteAppointment(id);
            getResponse(res);
        }
    };

    return (
        <Box>
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Appointment Management</Typography>

                <BasicModal buttonLabel="New Appointment">
                    <CreateAppointmentForm />
                </BasicModal>
            </Box>

            <Divider />
            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>SL</TableCell>
                                <TableCell align="left">Patient Name</TableCell>
                                <TableCell align="left">Contact Number</TableCell>
                                <TableCell align="left">Visiting Date</TableCell>
                                <TableCell align="left">Visiting Time</TableCell>
                                <TableCell align="left">Type</TableCell>
                                <TableCell align="left">Connector</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments?.data?.map((row: TAppointment, index: number) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left">{index + 1}</TableCell>
                                    <TableCell align="left" component="th" scope="row">
                                        {row.patientInfo?.name}
                                    </TableCell>
                                    <TableCell align="left">{row.patientInfo?.contactNumber}</TableCell>
                                    <TableCell align="left">{row.visitingDate}</TableCell>
                                    <TableCell align="left">{row.visitingTime || "N/A"}</TableCell>
                                    <TableCell align="left">{row.patientType}</TableCell>
                                    <TableCell align="left">{row.connector?.name || "N/A"}</TableCell>
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
                                                onClick={() => handleEdit(row.id as number)}
                                            />
                                            <Delete
                                                color="error"
                                                sx={{ cursor: "pointer" }}
                                                onClick={() => handleDelete(row.id as number)}
                                            />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Edit Modal */}
            <UpdateModal
                open={editModalOpen}
                handleClose={() => setEditModalOpen(false)}
            >
                {selectedAppointmentId && (
                    <UpdateAppointmentForm
                        id={selectedAppointmentId}
                        onCancel={() => setEditModalOpen(false)}
                    />
                )}
            </UpdateModal>
        </Box>
    );
}