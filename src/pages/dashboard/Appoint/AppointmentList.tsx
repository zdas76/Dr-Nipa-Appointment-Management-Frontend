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
    TextField,
    Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Edit, Print, SwapHoriz } from "@mui/icons-material";
import type { TAppointment } from "../../../types/User";
import { toast } from "sonner";
import UpdateModal from "../../../component/Modal/UpdateModal";
import UpdateAppointmentForm from "../../../component/Appointment/UpdateAppointmentForm";

type Status = "BOOKED" | "PRESENT" | "ABSENT" | "VISITED";

const STATUS_CONFIG: Record<Status, { label: string; color: "warning" | "success" | "error" | "primary" }> = {
    BOOKED: { label: "Booked", color: "warning" },
    PRESENT: { label: "Present", color: "success" },
    ABSENT: { label: "Absent", color: "error" },
    VISITED: { label: "Visited", color: "primary" },
};

const ALL_STATUSES: Status[] = ["BOOKED", "PRESENT", "ABSENT", "VISITED"];

export default function AppointmentList() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [activeTab, setActiveTab] = useState<string>("BOOKED");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editAppointmentId, setEditAppointmentId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState("");

    const formatTime12h = (time: string): string => {
        if (!time) return "";
        const [hourStr, minuteStr] = time.split(":");
        let hour = parseInt(hourStr, 10);
        const minute = minuteStr?.slice(0, 2) ?? "00";
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const handlePrint = (row: TAppointment) => {
        const params = new URLSearchParams({
            patientId: row.patientId?.toString() ?? "",
            patientName: row.patientInfo?.name ?? "",
            gender: row.patientInfo?.sex ?? "",
            age: row.patientInfo?.age?.toString() ?? "",
            patientType: row.patientType ?? "",
            visitingFee: String(row.visitingFee ?? ""),
            contactNumber: row.patientInfo?.contactNumber ?? "",
            visitingDate: new Date(row.visitingDate).toDateString().split('T')[0] ?? "",
            visitingTime: formatTime12h(row.visitingTime ?? ""),
        });
        window.open(`/print-page?${params.toString()}`, "_blank");
    };

    // Per-row menu state
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuAppointmentId, setMenuAppointmentId] = useState<number | null>(null);

    const { data: appointments } = useGetAllAppointmentByDateQuery(date, {
        refetchOnMountOrArgChange: true,
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

    const allData: TAppointment[] = appointments?.data ?? [];
    const filteredAppointments =
        allData.filter((item) => {
            const searchTerm = searchText.toLowerCase();
            const patientName = (item.patientInfo?.name || "").toLowerCase();
            const patientContact = (item.patientInfo?.contactNumber || "").toLowerCase();
            const patientId = (item.patientId?.toString() || "").toLowerCase();

            return (
                patientName.includes(searchTerm) ||
                patientContact.includes(searchTerm) ||
                patientId.includes(searchTerm)
            );
        });

    const counts: Record<Status, number> = {
        BOOKED: filteredAppointments.filter((i) => (i.status ?? "BOOKED") === "BOOKED").length,
        PRESENT: filteredAppointments.filter((i) => i.status === "PRESENT").length,
        ABSENT: filteredAppointments.filter((i) => i.status === "ABSENT").length,
        VISITED: filteredAppointments.filter((i) => i.status === "VISITED").length,
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

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
    };

    const selectedAppointment = allData.find((item) => item.id === menuAppointmentId);
    const currentStatus = (selectedAppointment?.status ?? "BOOKED") as Status;
    const currentPaymentStatus = selectedAppointment?.paymentStatus;

    const getFilteredMenuStatuses = (): Status[] => {
        if (currentStatus === "BOOKED") {
            return ["PRESENT", "ABSENT"];
        }
        if (currentStatus === "PRESENT") {
            return ["VISITED", "ABSENT"];
        }
        if (currentStatus === "ABSENT") {
            return ["BOOKED", "PRESENT"];
        }
        return ALL_STATUSES;
    };

    const isMenuItemDisabled = (s: Status): boolean => {
        if (s === currentStatus) return true;
        if (currentStatus === "PRESENT" && s === "VISITED") {
            return currentPaymentStatus !== "PAID";
        }
        return false;
    };

    return (
        <Box>
            {/* Date Selector */}
            <Box className="flex items-center justify-between gap-4 py-2 my-2 w-full">
                <Box className="flex-1">
                    <TextField
                        placeholder="Search by name or phone number or Patient Id"
                        size="small"
                        type="text"
                        fullWidth
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
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


            </Box>

            <TabContext value={activeTab}>
                {/* Status Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <TabList
                        onChange={handleTabChange}
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
                    </TabList>
                </Box>

                <Box sx={{ mt: 2 }}>

                </Box>
                {/* Tab Panels with Table */}
                {ALL_STATUSES.map((s) => {
                    const filtered = filteredAppointments.filter((item) => (item.status ?? "BOOKED") === s);
                    return (
                        <TabPanel key={s} value={s} sx={{ p: 0 }}>
                            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 2 }}>
                                <Table sx={{ minWidth: 650 }} aria-label="appointment list table">
                                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>SL</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>PatientId</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Contact</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Refferance By</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Gender</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Payment Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }} align="left">
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filtered.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center" sx={{ py: 6, color: "#94a3b8" }}>
                                                    No {STATUS_CONFIG[s].label} appointments for this date.
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
                                                        <TableCell>{row.patientInfo?.patientId ?? "—"}</TableCell>
                                                        <TableCell>{row.patientInfo?.contactNumber ?? "—"}</TableCell>
                                                        <TableCell>{row.connectorInfo?.name ? `${row.connectorInfo?.name} (${row.connectorInfo?.diagnosticName})` : "—"}</TableCell>
                                                        <TableCell>{row.patientInfo?.sex ?? "—"}</TableCell>
                                                        <TableCell>{row.patientInfo?.age ?? "—"}</TableCell>
                                                        <TableCell>{row.patientType}</TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={STATUS_CONFIG[status].label}
                                                                color={STATUS_CONFIG[status].color}
                                                                size="small"
                                                                sx={{ fontWeight: 700 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={row.paymentStatus}
                                                                color={row.paymentStatus === "PAID" ? "success" : "error"}
                                                                size="small"
                                                                sx={{ fontWeight: 700 }}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                                startIcon={<SwapHoriz />}
                                                                onClick={(e) => openMenu(e, row.id as number)}
                                                                disabled={isUpdating || status === "VISITED"}
                                                                sx={{
                                                                    textTransform: "none",
                                                                    borderRadius: 2,
                                                                    fontSize: 12,
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                Change
                                                            </Button>

                                                            {status === "PRESENT" && (
                                                                <Edit
                                                                    color="primary"
                                                                    sx={{ cursor: "pointer", ml: 1 }}
                                                                    onClick={() => {
                                                                        setEditAppointmentId(row.id as number);
                                                                        setEditModalOpen(true);
                                                                    }}
                                                                />
                                                            )}

                                                            {(status === "PRESENT" || status === "VISITED") && row.paymentStatus === "PAID" && <Print color="secondary" sx={{ cursor: "pointer", ml: 1 }} onClick={() => handlePrint(row)} />}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    );
                })}
            </TabContext>

            {/* Update Modal */}
            <UpdateModal
                open={editModalOpen}
                handleClose={() => {
                    setEditModalOpen(false);
                    setEditAppointmentId(null);
                }}
            >
                {editAppointmentId !== null && (
                    <UpdateAppointmentForm
                        id={editAppointmentId}
                        onCancel={() => {
                            setEditModalOpen(false);
                            setEditAppointmentId(null);
                        }}
                    />
                )}
            </UpdateModal>

            {/* Status Change Dropdown Menu */}

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                {getFilteredMenuStatuses().map((s) => (
                    <MenuItem
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        sx={{ gap: 1 }}
                        disabled={isMenuItemDisabled(s)}
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

