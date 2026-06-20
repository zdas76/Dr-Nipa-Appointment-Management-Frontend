import { Box, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import CreateAppointmentForm from "../../../component/Appointment/CreateAppointmentForm";
import UpdateAppointmentForm from "../../../component/Appointment/UpdateAppointmentForm";
import BasicModal from "../../../component/Modal/BasicModel";
import UpdateModal from "../../../component/Modal/UpdateModal";
import { useDeleteAppointmentMutation, useGetAllAppointmentByDateQuery } from "../../../redux/api/appointment";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { getResponse } from "../../../utils/getResponst";
import type { TAppointment } from "../../../types/User";
import { Link } from "react-router";
import Swal from 'sweetalert2'
import dayjs from 'dayjs'

export default function AppointmentManagement() {

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const { data: appointments } = useGetAllAppointmentByDateQuery(date, {
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

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteAppointment(id);
                getResponse(res);

                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
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

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", my: 2, gap: 2 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Select Date : </Typography>
                <TextField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Box>

            <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>SL</TableCell>
                                <TableCell align="left">Patient Name</TableCell>
                                <TableCell align="left">Contact Number</TableCell>
                                <TableCell align="left">Gender</TableCell>
                                <TableCell align="left">Visiting Date</TableCell>
                                <TableCell align="left">Visiting Time</TableCell>
                                <TableCell align="left">Type</TableCell>
                                <TableCell align="left">Patient ID</TableCell>
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
                                    <TableCell align="left">{row.patientInfo?.sex}</TableCell>
                                    <TableCell align="left">{dayjs(row.visitingDate).format("DD-MM-YYYY")}</TableCell>
                                    <TableCell align="left">{row.visitingTime || "N/A"}</TableCell>
                                    <TableCell align="left">{row.patientType}</TableCell>
                                    <TableCell align="left">{row.patientId || "N/A"}</TableCell>
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
                                            {row.paymentStatus !== "PAID" ? (
                                                <Delete
                                                    color="error"
                                                    sx={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(row.id as number)}
                                                />
                                            ) : (
                                                <Delete
                                                    color="disabled"
                                                    sx={{ cursor: "not-allowed" }}
                                                />
                                            )}
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