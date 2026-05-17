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
    Email,
    Phone,
    LocalHospital,
    AttachMoney,
    Badge,
    CheckCircle,
    Cancel
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router";
import { useGetConnectorByIdQuery } from "../../../redux/api/connectorAPI";

export default function ViewConnectorInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetConnectorByIdQuery(Number(id));
    const connectorData = data?.data;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <Typography variant="h6" color="text.secondary">Loading connector details...</Typography>
            </Box>
        );
    }

    const isActive = !connectorData?.isDeleted;

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
            {/* Header with Back Button */}
            <Stack direction="row" sx={{ alignItems: "center", mb: 4, gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Connector Profile
                </Typography>
            </Stack>

            <Grid container spacing={4}>
                {/* Left Column: Profile Summary */}
                <Grid xs={12} md={4}>
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
                            bgcolor: "#8b5cf6",
                            mb: 3,
                            boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)"
                        }}>
                            <Person sx={{ fontSize: 70 }} />
                        </Avatar>

                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                            {connectorData?.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748b", mb: 2, fontWeight: 500 }}>
                            {connectorData?.diagnosticName || "No Diagnostic"}
                        </Typography>

                        <Chip
                            icon={isActive ? <CheckCircle /> : <Cancel />}
                            label={isActive ? "ACTIVE" : "DELETED"}
                            color={isActive ? "success" : "error"}
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
                                <Email sx={{ color: "#8b5cf6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {connectorData?.email || "N/A"}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Phone sx={{ color: "#8b5cf6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {connectorData?.contactNumber}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Column: Detailed Info */}
                <Grid xs={12} md={8}>
                    <Stack spacing={4}>
                        {/* Business Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <LocalHospital sx={{ color: "#8b5cf6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Business Information
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem icon={<LocalHospital />} label="Diagnostic Name" value={connectorData?.diagnosticName} />
                                <InfoItem icon={<Phone />} label="Contact Number" value={connectorData?.contactNumber} />
                                <InfoItem icon={<Email />} label="Email Address" value={connectorData?.email} />
                            </Grid>
                        </Paper>

                        {/* Fee Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <Badge sx={{ color: "#8b5cf6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Fee Structure
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem icon={<AttachMoney />} label="New Patient Fee" value={connectorData?.newPatientAmount?.toString()} />
                                <InfoItem icon={<AttachMoney />} label="Old Patient Fee" value={connectorData?.oldPatientAmount?.toString()} />
                                <InfoItem label="Connector ID" value={connectorData?.id?.toString()} />
                                <InfoItem label="Status" value={isActive ? "Active" : "Deleted"} />
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
        <Grid xs={12} sm={6}>
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