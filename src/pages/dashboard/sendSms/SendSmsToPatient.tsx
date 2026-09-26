import { useState } from "react";
import { useGetAllAppointmentByDateQuery } from "../../../redux/api/appointment";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
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
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useSendSmsMutation } from "../../../redux/api/sms";

export default function SendSmsToPatient() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selected, setSelected] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const [sendSms, { isLoading }] = useSendSmsMutation();
  const { data: appointments } = useGetAllAppointmentByDateQuery(date, {
    refetchOnMountOrArgChange: true,
  });
  const allAppointments: TAppointment[] = appointments?.data ?? [];

  // Only show appointments with a usable contact number.
  const bookAppointments = allAppointments.filter((app) =>
    app.patientInfo?.contactNumber?.trim(),
  );

  const allIds = bookAppointments.map((_, i) => i);

  const isAllSelected =
    bookAppointments.length > 0 && selected.length === bookAppointments.length;
  const isIndeterminate =
    selected.length > 0 && selected.length < bookAppointments.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelected([]);
    } else {
      setSelected(allIds);
    }
  };

  const handleToggle = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const selectedContacts = selected
    .map((i) => bookAppointments[i]?.patientInfo?.contactNumber)
    .filter((contactNumber): contactNumber is string =>
      Boolean(contactNumber?.trim()),
    )
    .map((contactNumber) => contactNumber.trim());

  const handelSendMessage = async () => {
    try {
      const appointmentInfo = selected
        .map((index) => bookAppointments[index])
        .filter((app): app is TAppointment & { id: number } =>
          Boolean(app?.id && app.patientInfo?.contactNumber?.trim()),
        )
        .map((app) => ({
          contactNumber: app.patientInfo!.contactNumber!.trim(),
          appointmentId: app.id,
        }));
      const messageContent = message.trim();

      const res = await sendSms({ appointmentInfo, messageContent });

      if (res.data) {
        await Swal.fire({
          title: "SMS sent successfully",
          text: "SMS sent successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      await Swal.fire({
        title: "SMS failed",
        text: `"The message could not be sent. Please try again." ${error},`,
        icon: "error",
      });
    }
  };

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

      {/* Stats + Select-All action */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={`Total: ${bookAppointments.length}`}
            color="default"
            size="small"
          />
          <Chip
            label={`Selected: ${selected.length}`}
            color="primary"
            size="small"
          />
        </Box>
      </Box>

      {/* Patient List Table */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, mb: 3 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={isIndeterminate}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  disabled={bookAppointments.length === 0}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Sex</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookAppointments.length === 0 ? (
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
              bookAppointments.map((app: TAppointment, index: number) => {
                const isChecked = selected.includes(index);
                return (
                  <TableRow
                    key={index}
                    hover
                    selected={isChecked}
                    onClick={() => handleToggle(index)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleToggle(index)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
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
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message + Send */}
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {selected.length > 0 && (
          <Box>
            <Typography
              variant="body2"
              className="uppercase font-bold text-sm text-blue-700"
            >
              Selected patients for sending SMS:
            </Typography>
            <Typography>
              <strong>{selectedContacts.join(", ")}</strong>
            </Typography>
          </Box>
        )}
        <TextField
          label="Write message here"
          multiline
          rows={5}
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={selected.length === 0 || isLoading}
          onClick={handelSendMessage}
        >
          {isLoading
            ? "Sending..."
            : `Send to ${selected.length} Patient${selected.length !== 1 ? "s" : ""}`}
        </Button>
      </Box>
    </Box>
  );
}
