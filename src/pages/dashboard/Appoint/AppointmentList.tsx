import { useState } from "react";
import {
    useGetAllAppointmentByDateQuery,
    useUpdateAppointmentStatusMutation,
} from "../../../redux/api/appointment";
import {
    Box,
    Button,
    Chip,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import type { TAppointment } from "../../../types/User";
import { toast } from "sonner";

type Status = "BOOKED" | "PRESENT" | "ABSENT";

const STATUS_CONFIG: Record<Status, { label: string; color: "warning" | "success" | "error" }> = {
    BOOKED: { label: "Booked", color: "warning" },
    PRESENT: { label: "Present", color: "success" },
    ABSENT: { label: "Absent", color: "error" },
};

const ALL_STATUSES: Status[] = ["BOOKED", "PRESENT", "ABSENT"];

export default function AppointmentList() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeTab, setActiveTab] = useState<Status>("BOOKED");

    // Per-row menu state
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuAppointmentId, setMenuAppointmentId] = useState<number | null>(null);

    const { data: appointments } = useGetAllAppointmentByDateQuery(date, {
        refetchOnMountOrArgChange: true,
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

    const allData: TAppointment[] = appointments?.data ?? [];

    const filtered = allData.filter((item) => (item.status ?? "BOOKED") === activeTab);

    const counts: Record<Status, number> = {
        BOOKED: allData.filter((i) => (i.status ?? "BOOKED") === "BOOKED").length,
        PRESENT: allData.filter((i) => i.status === "PRESENT").length,
        ABSENT: allData.filter((i) => i.status === "ABSENT").length,
    };

    const openMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setMenuAnchor(event.currentTarget);
        setMenuAppointmentId(id);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        setMenuAppointmentId(null);
    };

    const handleStatusChange = async (newStatus: Status) => {
        if (!menuAppointmentId) return;
        try {
            await updateStatus({ id: menuAppointmentId, status: newStatus }).unwrap();
            toast.success(`Status changed to ${newStatus}`);
        } catch {
            toast.error("Failed to update status");
        }
        closeMenu();
    };

    return (
        <Box>
            {/* Date Selector */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    my: 2,
                    gap: 2,
                }}
            >
                <Typography sx={{ fontSize: 16, fontWeight: 500 }}>Select Date:</Typography>
                <TextField
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    size="small"
                />
            </Box>

            {/* Status Tabs */}
            <Box sx={{ width: "100%", mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v: Status) => setActiveTab(v)}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="appointment status tabs"
                >
                    {ALL_STATUSES.map((s) => (
                        <Tab
                            key={s}
                            value={s}
                            label={
                                <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
                                    {STATUS_CONFIG[s].label}
                                    <Chip
                                        label={counts[s]}
                                        size="small"
                                        color={STATUS_CONFIG[s].color}
                                        sx={{ height: 20, fontSize: 11, fontWeight: 700 }}
                                    />
                                </Stack>
                            }
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="appointment list table">
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>SL</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Visiting Time</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }} align="center">
                                Change Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 6, color: "#94a3b8" }}>
                                    No {STATUS_CONFIG[activeTab].label} appointments for this date.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((row, index) => {
                                const status = (row.status ?? "BOOKED") as Status;
                                return (
                                    <TableRow
                                        key={row.id}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.patientInfo?.name ?? "—"}
                                        </TableCell>
                                        <TableCell>{row.patientInfo?.contactNumber ?? "—"}</TableCell>
                                        <TableCell>{row.patientInfo?.sex ?? "—"}</TableCell>
                                        <TableCell>{row.visitingTime ?? "N/A"}</TableCell>
                                        <TableCell>{row.patientType}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={STATUS_CONFIG[status].label}
                                                color={STATUS_CONFIG[status].color}
                                                size="small"
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<SwapHoriz />}
                                                onClick={(e) => openMenu(e, row.id as number)}
                                                disabled={isUpdating}
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: 2,
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                Change
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Status Change Dropdown Menu */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                {ALL_STATUSES.map((s) => (
                    <MenuItem
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        sx={{ gap: 1 }}
                    >
                        <Chip
                            label={STATUS_CONFIG[s].label}
                            color={STATUS_CONFIG[s].color}
                            size="small"
                            sx={{ fontWeight: 700, minWidth: 70 }}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}
