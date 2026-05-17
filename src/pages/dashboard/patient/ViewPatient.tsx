import {
    Box,
    Grid,
    Typography,
    Divider,
    Paper,
    Avatar,
    Stack,
    IconButton
} from "@mui/material";
import {
    ArrowBack,
    Person,
    Phone,
    Wc,
    Badge,
    LocationOn,
    Event
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router";
import { useGetPatientByIdQuery } from "../../../redux/api/patientAPI";

export default function ViewPatient() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetPatientByIdQuery(Number(id));
    const patientData = data?.data;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <Typography variant="h6" color="text.secondary">Loading patient details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
            {/* Header with Back Button */}
            <Stack sx={{ flexDirection: "row", alignItems: "center", mb: 4, gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Patient Profile
                </Typography>
            </Stack>

            <Grid container spacing={4}>
                {/* Left Column: Profile Summary */}
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

                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
                            {patientData?.name}
                        </Typography>

                        <Divider sx={{ width: "100%", mb: 4 }} />

                        <Stack sx={{ gap: 2, width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Phone sx={{ color: "#3b82f6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {patientData?.contactNumber}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <LocationOn sx={{ color: "#3b82f6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {patientData?.address}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Column: Detailed Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack sx={{ gap: 4 }}>
                        {/* Personal Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <Badge sx={{ color: "#3b82f6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Personal Information
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem label="Age" value={patientData?.age?.toString()} icon={<Person />} />
                                <InfoItem label="Gender" value={patientData?.sex} icon={<Wc />} />
                                <InfoItem label="Contact" value={patientData?.contactNumber} icon={<Phone />} />
                                <InfoItem label="Address" value={patientData?.address} icon={<LocationOn />} />
                            </Grid>
                        </Paper>

                        {/* System Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <Badge sx={{ color: "#3b82f6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Record Details
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem label="Patient ID" value={patientData?.id?.toString()} icon={<Badge />} />
                                <InfoItem label="Created At" value={patientData?.createdAt ? new Date(patientData.createdAt).toLocaleDateString() : "N/A"} icon={<Event />} />
                                <InfoItem label="Last Updated" value={patientData?.updatedAt ? new Date(patientData.updatedAt).toLocaleDateString() : "N/A"} icon={<Event />} />
                            </Grid>
                        </Paper>
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
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
                {icon && <Box sx={{ color: "#94a3b8", display: "flex" }}>{icon}</Box>}
                <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 600 }}>
                    {value || "N/A"}
                </Typography>
            </Stack>
        </Grid>
    );
}