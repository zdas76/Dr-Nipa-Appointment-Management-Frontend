import {
    Box,
    Grid,
    Typography,
    Divider,
    Paper,
    Avatar,
    Chip,
    Stack,
    IconButton
} from "@mui/material";
import {
    ArrowBack,
    Person,
    Phone,
    CalendarToday,
    AccessTime,
    AttachMoney,
    MedicalServices,
    LocalHospital
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router";
import { useGetAppointmentByIdQuery } from "../../../redux/api/appointment";

export default function ViewAppointmentinfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetAppointmentByIdQuery(Number(id));
    const appointmentData = data?.data;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <Typography variant="h6" color="text.secondary">Loading appointment details...</Typography>
            </Box>
        );
    }

    const isNew = appointmentData?.patientType === "NEW";

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
            {/* Header with Back Button */}
            <Stack direction="row" sx={{ alignItems: "center", mb: 4, gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Appointment Details
                </Typography>
            </Stack>

            <Grid container spacing={4}>
                {/* Left Column: Patient Summary */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{
                        p: 4,
                        borderRadius: 4,
                        border: "1px solid #e2e8f0",
                        textAlign: "center",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Avatar sx={{
                            width: 120,
                            height: 120,
                            bgcolor: "#3b82f6",
                            mb: 3,
                            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)"
                        }}>
                            <Person sx={{ fontSize: 70 }} />
                        </Avatar>

                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                            {appointmentData?.patientInfo?.name || appointmentData?.patient?.name || "Unknown Patient"}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748b", mb: 2, fontWeight: 500 }}>
                            Patient
                        </Typography>

                        <Chip
                            label={appointmentData?.patientType || "UNKNOWN"}
                            color={isNew ? "success" : "primary"}
                            variant="filled"
                            sx={{
                                fontWeight: 700,
                                px: 1,
                                borderRadius: 2,
                                mb: 4
                            }}
                        />

                        <Divider sx={{ width: "100%", mb: 4 }} />

                        <Stack spacing={2} sx={{ width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Phone sx={{ color: "#3b82f6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {appointmentData?.patientInfo?.contactNumber || appointmentData?.patient?.contactNumber || "N/A"}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Column: Detailed Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={4}>
                        {/* Appointment Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <CalendarToday sx={{ color: "#3b82f6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Schedule Information
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem icon={<CalendarToday />} label="Visiting Date" value={appointmentData?.visitingDate} />
                                <InfoItem icon={<AccessTime />} label="Visiting Time" value={appointmentData?.visitingTime} />
                                <InfoItem icon={<AttachMoney />} label="Visiting Fee" value={appointmentData?.visitingFee ? `${appointmentData.visitingFee} BDT` : "N/A"} />
                                <InfoItem icon={<AttachMoney />} label="Discount" value={appointmentData?.discount ? `${appointmentData.discount} BDT` : "0 BDT"} />
                            </Grid>
                        </Paper>

                        {/* Additional Health Info */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <MedicalServices sx={{ color: "#3b82f6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Health Indicators
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem label="Blood Group" value={appointmentData?.bloodGroup} />
                                <InfoItem label="Blood Pressure" value={appointmentData?.booldPusher} />
                                <InfoItem label="Weight (kg)" value={appointmentData?.weight?.toString()} />
                            </Grid>
                        </Paper>

                        {/* Connector Info */}
                        {appointmentData?.connectorId && (
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                    <LocalHospital sx={{ color: "#3b82f6" }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                        Connector / Diagnostic
                                    </Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <InfoItem label="Connector Name" value={appointmentData?.connectorInfo?.name || appointmentData?.connector?.name} />
                                    <InfoItem label="Diagnostic Name" value={appointmentData?.connectorInfo?.diagnosticName || appointmentData?.connector?.diagnosticName} />
                                    <InfoItem label="Contact Number" value={appointmentData?.connectorInfo?.contactNumber || appointmentData?.connector?.contactNumber} />
                                </Grid>
                            </Paper>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}

interface InfoItemProps {
    label: string;
    value?: string;
    icon?: React.ReactNode;
}

function InfoItem({ label, value, icon }: InfoItemProps) {
    return (
        <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" sx={{
                color: "#64748b",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                mb: 0.5
            }}>
                {label}
            </Typography>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                {icon && <Box sx={{ color: "#94a3b8", display: "flex" }}>{icon}</Box>}
                <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 600 }}>
                    {value || "N/A"}
                </Typography>
            </Stack>
        </Grid>
    );
}
