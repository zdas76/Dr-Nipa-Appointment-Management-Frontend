import { Box, Typography } from "@mui/material"
import CreateAppointmentForm from "../../../component/Appointment/CreateAppointmentForm";
import BasicModal from "../../../component/Modal/BasicModel";

export default function AppointmentManagement() {
    return (
        <Box>
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Create Appointment</Typography>

                <BasicModal buttonLabel="Add Appointment">
                    <CreateAppointmentForm />
                </BasicModal>
            </Box>

            <Box sx={{ mt: 3 }}>
                {/* Table or List of Appointments will go here */}
            </Box>
        </Box>
    )
}