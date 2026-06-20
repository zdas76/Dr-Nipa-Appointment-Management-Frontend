/* eslint-disable @typescript-eslint/no-explicit-any */
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
    Cake,
    Wc,
    AccountBox,
    Badge,
    CheckCircle,
    Cancel
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router";
import { useGetAssistantByIdQuery } from "../../../redux/api/assistantAPI";

export default function ViewAssistantInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetAssistantByIdQuery(Number(id));
    const assistantData = (data as any)?.data;

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <Typography variant="h6" color="text.secondary">Loading assistant details...</Typography>
            </Box>
        );
    }

    const isActive = assistantData?.users?.status === "ACTIVE";

    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
            {/* Header with Back Button */}
            <Stack direction="row" sx={{ alignItems: "center", mb: 4, gap: 2 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "white", boxShadow: 1 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Assistant Profile
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

                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
                            {assistantData?.name}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#64748b", mb: 2, fontWeight: 500 }}>
                            @{assistantData?.users?.userName || "username"}
                        </Typography>

                        <Chip
                            icon={isActive ? <CheckCircle /> : <Cancel />}
                            label={assistantData?.users?.status || "UNKNOWN"}
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
                                <Email sx={{ color: "#3b82f6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {assistantData?.email}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Phone sx={{ color: "#3b82f6" }} />
                                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, textAlign: "left" }}>
                                    {assistantData?.contactNumber}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>

                {/* Right Column: Detailed Info */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={4}>
                        {/* Personal Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <Badge sx={{ color: "#3b82f6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Personal Information
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem icon={<AccountBox />} label="Father's Name" value={assistantData?.fatherName} />
                                <InfoItem icon={<AccountBox />} label="Mother's Name" value={assistantData?.motherName} />
                                <InfoItem icon={<Cake />} label="Date of Birth" value={assistantData?.dateOfBirth ? new Date(assistantData.dateOfBirth).toISOString().split('T')[0] : "N/A"} />
                                <InfoItem icon={<Wc />} label="Gender" value={assistantData?.sex} />
                            </Grid>
                        </Paper>

                        {/* Account Details Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                                <Badge sx={{ color: "#3b82f6" }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Account & Role
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                <InfoItem label="System Role" value={assistantData?.users?.role} />
                                <InfoItem label="Account ID" value={assistantData?.users?.id?.toString()} />
                                <InfoItem label="Registration Date" value={assistantData?.createdAt ? new Date(assistantData.createdAt).toLocaleDateString() : "N/A"} />
                                <InfoItem label="Last Updated" value={assistantData?.updatedAt ? new Date(assistantData.updatedAt).toLocaleDateString() : "N/A"} />
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
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                {icon && <Box sx={{ color: "#94a3b8", display: "flex" }}>{icon}</Box>}
                <Typography variant="body1" sx={{ color: "#1e293b", fontWeight: 600 }}>
                    {value || "N/A"}
                </Typography>
            </Stack>
        </Grid>
    );
}