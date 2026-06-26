/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Grid,
    Typography,
    Divider,
    Paper,
    Avatar,
    Stack,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
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

type Status = "BOOKED" | "PRESENT" | "ABSENT" | "VISITED";

const STATUS_CONFIG: Record<Status, { label: string; color: "warning" | "success" | "error" | "primary" }> = {
    BOOKED: { label: "Booked", color: "warning" },
    PRESENT: { label: "Present", color: "success" },
    ABSENT: { label: "Absent", color: "error" },
    VISITED: { label: "Visited", color: "primary" },
};

export default function ViewPatient() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading } = useGetPatientByIdQuery(Number(patientId));
    const patientData = (data as any)?.data;

    console.log(data)

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

                        {/* Appointment History Card */}
                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                                <Stack direction="row" sx={{ alignItems: "center", gap: 1.5 }}>
                                    <Event sx={{ color: "#3b82f6" }} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                        Appointment History
                                    </Typography>
                                </Stack>
                                <Chip
                                    label={`${patientData?.appointments?.length || 0} Total`}
                                    size="small"
                                    sx={{ fontWeight: 700, bgcolor: "#eff6ff", color: "#3b82f6" }}
                                />
                            </Box>

                            {(!patientData?.appointments || patientData.appointments.length === 0) ? (
                                <Box sx={{ py: 6, textAlign: "center", color: "#94a3b8" }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                        No appointments found for this patient.
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table sx={{ minWidth: 500 }}>
                                        <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Date</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Type</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Payment</TableCell>
                                                <TableCell sx={{ fontWeight: 700, color: "#475569" }} align="right">Fee</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {patientData.appointments.map((appt: any, idx: number) => {
                                                const fee = appt.visitingFee ?? 0;
                                                const disc = appt.discount ?? 0;
                                                const netFee = Math.max(0, fee - disc);
                                                const status = (appt.status ?? "BOOKED") as Status;

                                                return (
                                                    <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                                        <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                                                            {new Date(appt.visitingDate).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={appt.patientType}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: "11px",
                                                                    bgcolor: appt.patientType === "NEW" ? "#ecfdf5" : "#f0f9ff",
                                                                    color: appt.patientType === "NEW" ? "#059669" : "#0284c7",
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={STATUS_CONFIG[status]?.label || status}
                                                                color={STATUS_CONFIG[status]?.color || "default"}
                                                                size="small"
                                                                sx={{ fontWeight: 700, fontSize: "11px" }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={appt.paymentStatus}
                                                                size="small"
                                                                sx={{
                                                                    fontWeight: 700,
                                                                    fontSize: "11px",
                                                                    bgcolor: appt.paymentStatus === "PAID" ? "#ecfdf5" : appt.paymentStatus === "UNPAID" ? "#fef2f2" : "#fffbeb",
                                                                    color: appt.paymentStatus === "PAID" ? "#059669" : appt.paymentStatus === "UNPAID" ? "#dc2626" : "#d97706",
                                                                }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                                            {disc > 0 ? (
                                                                <Stack spacing={0.2} sx={{ alignItems: "flex-end" }}>
                                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                                        ৳{netFee}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#94a3b8" }}>
                                                                        ৳{fee}
                                                                    </Typography>
                                                                </Stack>
                                                            ) : (
                                                                `৳${fee}`
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
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