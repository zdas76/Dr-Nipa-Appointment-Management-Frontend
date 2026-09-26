import { useState } from "react";
import { useGetAllAppointmentByDateQuery } from "../../../redux/api/appointment";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import type { TAppointment } from "../../../types/User";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Check,
  Close,
  DoNotDisturb,
  ReviewsOutlined,
} from "@mui/icons-material";
import { useGetSMSByMessageIdQuery } from "../../../redux/api/sms";

const smsStatusDescriptions: Record<string, string> = {
  "109": "API key not provided",
  "108": "Wrong password or password not provided",
  "114": "Message ID missing, invalid, or already queried",
  "101": "Internal server error",
  "-42": "Authorization failed",
  "1": "Request failed",
  "2": "Request pending",
  "4": "Request sent",
  "0": "Message Send",
};

export default function SmsStatus() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedMessageId, setSelectedMessageId] = useState("");

  const { data: appointments } = useGetAllAppointmentByDateQuery(date, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: getSMSStatus,
    isFetching: isFetchingSMSStatus,
    isError: isSMSStatusError,
  } = useGetSMSByMessageIdQuery(selectedMessageId, {
    skip: !selectedMessageId,
  });

  const smsStatus = getSMSStatus?.data;
  const smsStatusCode = String(smsStatus?.Status ?? "");
  const smsStatusDescription =
    smsStatusDescriptions[smsStatusCode] || smsStatus?.Status || "—";
  const smsStatusColor: "success" | "warning" | "info" | "error" =
    smsStatusCode === "0"
      ? "success"
      : smsStatusCode === "2"
        ? "warning"
        : smsStatusCode === "4"
          ? "info"
          : "error";

  const deliveryTime = smsStatus?.["Delivery Time"];
  const parsedDeliveryTime = deliveryTime ? Number(deliveryTime) : NaN;
  const formattedDeliveryTime = Number.isFinite(parsedDeliveryTime)
    ? new Date(parsedDeliveryTime).toLocaleString()
    : deliveryTime;

  const allAppointments: TAppointment[] = appointments?.data ?? [];

  return (
    <Box sx={{ p: 3, bgcolor: "white", borderRadius: 3 }}>
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
        >
          Send SMS to Patients
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            sx={{ fontSize: 15, fontWeight: 500, color: "text.secondary" }}
          >
            Select Date:
          </Typography>
          <TextField
            type="date"
            value={date}
            size="small"
            onChange={(e) => setDate(e.target.value)}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Patient List Table */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, mb: 3 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Sex</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>SMS status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allAppointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No booked appointments found for this date.
                </TableCell>
              </TableRow>
            ) : (
              allAppointments?.map((app: TAppointment, index: number) => {
                return (
                  <TableRow key={index} hover sx={{ cursor: "pointer" }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{app.patientInfo?.name ?? "—"}</TableCell>
                    <TableCell>
                      {app.patientInfo?.contactNumber ?? "—"}
                    </TableCell>
                    <TableCell>{app.patientInfo?.sex ?? "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={app.patientType}
                        size="small"
                        color={
                          app.patientType === "NEW" ? "success" : "warning"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={app.status ?? "BOOKED"}
                        size="small"
                        color="info"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      {app?.sendMessage?.map((message) => (
                        <Typography>
                          {message.contactNumber ? (
                            <Check color="success" />
                          ) : (
                            <DoNotDisturb color="error" />
                          )}

                          <IconButton
                            aria-label="View SMS delivery status"
                            title="View SMS delivery status"
                            color="success"
                            disabled={!message?.message_ID}
                            onClick={() =>
                              setSelectedMessageId(message.message_ID)
                            }
                          >
                            <ReviewsOutlined fontSize="medium" />
                          </IconButton>
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(selectedMessageId)}
        onClose={() => setSelectedMessageId("")}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          SMS Delivery Status
          <IconButton
            aria-label="Close status dialog"
            onClick={() => setSelectedMessageId("")}
            edge="end"
            className="bg-red-500 text-white"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {isFetchingSMSStatus ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={28} />
            </Box>
          ) : isSMSStatusError ? (
            <Typography color="error">
              Could not load the SMS delivery status.
            </Typography>
          ) : smsStatus ? (
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 1.5 }}
            >
              <Typography sx={{ fontWeight: 600 }}>Status</Typography>
              <Chip
                label={smsStatusDescription}
                color={smsStatusColor}
                size="small"
              />
              <Typography sx={{ fontWeight: 600 }}>Text</Typography>
              <Typography>{smsStatus.Text || "—"}</Typography>
              <Typography sx={{ fontWeight: 600 }}>Delivery Time</Typography>
              <Typography>{formattedDeliveryTime || "—"}</Typography>
            </Box>
          ) : (
            <Typography color="text.secondary">
              No delivery status is available for this message.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
