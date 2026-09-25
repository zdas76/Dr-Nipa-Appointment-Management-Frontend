/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  CircularProgress,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useGetAppointmentDailyReportByDateQuery } from "../../../redux/api/report";
import PeopleIcon from "@mui/icons-material/People";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PrintIcon from "@mui/icons-material/Print";

const SummaryCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          "&:last-child": { pb: 3 },
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(color, 0.1),
            color: color,
            width: 56,
            height: 56,
            mr: 3,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600, mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function DailyReport() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const theme = useTheme();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: dailyReport, isLoading } =
    useGetAppointmentDailyReportByDateQuery(date, {
      skip: !date,
      refetchOnMountOrArgChange: true,
    });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Daily Report - ${date}`,
    pageStyle: `
            @page { size: A4; margin: 12mm; }
            body { font-family: Arial, sans-serif; }
            .print-section { display: block !important; }
            .no-print { display: none !important; }
            .print-card { box-shadow: none !important; border: 1px solid #d1d5db !important; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f8fafc; }
        `,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  // Define categories to display
  const categories = [
    "NewPatientFemale",
    "NewPatientMale",
    "OldPatientFemale",
    "OldPatientMale",
  ];

  // Readable labels for categories
  const categoryLabels: Record<string, string> = {
    NewPatientFemale: "New Patient (Female)",
    NewPatientMale: "New Patient (Male)",
    OldPatientFemale: "Old Patient (Female)",
    OldPatientMale: "Old Patient (Male)",
  };

  // Helper to format numbers with commas
  const formatNumber = (num: number | string | undefined) =>
    Number(num ?? 0).toLocaleString();

  const getSubTotal = (cats: string[]) =>
    cats.reduce(
      (acc, cat) => {
        const data =
          (dailyReport as any)?.data?.[cat] ||
          (dailyReport as any)?.[cat] ||
          {};
        const visitingAmount = Number(data?.TotalVisitingAmount ?? 0);
        const connectorAmount = Number(data?.TotalConnectorAmount ?? 0);
        const discount = Number(data?.TotalDiscount ?? 0);
        acc.TotalPatient += Number(data?.TotalPatient ?? 0);
        acc.TotalDiscount += discount;
        acc.TotalVisitingAmount += visitingAmount;
        acc.TotalAmount += visitingAmount - connectorAmount - discount;
        return acc;
      },
      {
        TotalPatient: 0,
        TotalDiscount: 0,
        TotalVisitingAmount: 0,
        TotalAmount: 0,
      },
    );

  const newPatientTotal = getSubTotal(["NewPatientFemale", "NewPatientMale"]);
  const oldPatientTotal = getSubTotal(["OldPatientFemale", "OldPatientMale"]);

  // Calculate totals
  const totals = categories.reduce(
    (acc, cat) => {
      const data =
        (dailyReport as any)?.data?.[cat] || (dailyReport as any)?.[cat] || {};
      const visitingAmount = Number(data?.TotalVisitingAmount ?? 0);
      const connectorAmount = Number(data?.TotalConnectorAmount ?? 0);
      const discount = Number(data?.TotalDiscount ?? 0);

      acc.TotalConnector += Number(data?.TotalConnector ?? 0);
      acc.TotalConnectorAmount += connectorAmount;
      acc.TotalDiscount += discount;
      acc.TotalPatient += Number(data?.TotalPatient ?? 0);
      acc.TotalVisitingAmount += visitingAmount;
      acc.TotalAmount += visitingAmount - connectorAmount - discount;
      return acc;
    },
    {
      TotalConnector: 0,
      TotalConnectorAmount: 0,
      TotalDiscount: 0,
      TotalPatient: 0,
      TotalVisitingAmount: 0,
      TotalAmount: 0,
    },
  );

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
      className="print-section"
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
        className="no-print"
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.5px",
          }}
        >
          Daily Report
        </Typography>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
          className="no-print"
        >
          <Paper
            sx={{
              p: 0.5,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 2px 10px 0 rgba(0,0,0,0.02)",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                pl: 2,
                color: "text.secondary",
              }}
            >
              Date:
            </Typography>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                  bgcolor: "transparent",
                  minWidth: 150,
                },
              }}
            />
          </Paper>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => handlePrint()}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            Print Report
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
        className="print-section"
      >
        <Box className="print-card">
          <SummaryCard
            title="Total Patients"
            value={formatNumber(totals.TotalPatient)}
            icon={<PeopleIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Box>
        <Box className="print-card">
          <SummaryCard
            title="Visiting Amount"
            value={`৳ ${formatNumber(totals.TotalVisitingAmount)}`}
            icon={<AccountBalanceWalletIcon fontSize="large" />}
            color={theme.palette.info.main}
          />
        </Box>
        <Box className="print-card">
          <SummaryCard
            title="Total Discount"
            value={`৳ ${formatNumber(totals.TotalDiscount)}`}
            icon={<LocalOfferIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Box>
        <Box className="print-card">
          <SummaryCard
            title="Grand Total"
            value={`৳ ${formatNumber(totals.TotalAmount)}`}
            icon={<MonetizationOnIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Box>
      </Box>

      {/* Report Table */}
      <Paper
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
          border: "1px solid",
          borderColor: "divider",
        }}
        className="print-section"
      >
        <Box sx={{ overflowX: "auto" }} ref={printRef}>
          <Box className="text-right pt-3 pr-5">
            <Typography>Reporting Date: {date}</Typography>
          </Box>
          <Box className="text-center my-5">
            <Typography className="text-2xl font-bold uppercase underline">
              Daily Visited Patient Summery
            </Typography>
          </Box>
          <Table sx={{ minWidth: 700 }}>
            <TableHead
              sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}
            >
              <TableRow>
                <TableCell sx={{ fontWeight: 700, py: 2 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>
                  Total Patient
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>
                  Visiting Amount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>
                  Total Discount
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, py: 2 }}>
                  Grand Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Detail Rows */}
              {categories.map((cat) => {
                const data =
                  dailyReport?.data?.[cat] || dailyReport?.[cat] || {};
                const visitingAmount = Number(data?.TotalVisitingAmount ?? 0);
                const connectorAmount = Number(data?.TotalConnectorAmount ?? 0);
                const discount = Number(data?.TotalDiscount ?? 0);
                const grandTotal = visitingAmount - connectorAmount - discount;

                return (
                  <TableRow
                    key={cat}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                      },
                    }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: 500 }}
                    >
                      {categoryLabels[cat] || cat}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      {formatNumber(data?.TotalPatient ?? 0)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      {formatNumber(visitingAmount)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 500,
                        color: discount > 0 ? "warning.main" : "inherit",
                      }}
                    >
                      {formatNumber(discount)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatNumber(grandTotal)}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Subtotals Section Header */}
              <TableRow sx={{ bgcolor: alpha(theme.palette.divider, 0.04) }}>
                <TableCell
                  colSpan={5}
                  sx={{
                    fontWeight: 700,
                    py: 1.5,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  Subtotals
                </TableCell>
              </TableRow>

              {/* Totals New Patient Row */}
              <TableRow
                sx={{
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                  Total New Patient
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatNumber(newPatientTotal.TotalPatient)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatNumber(newPatientTotal.TotalVisitingAmount)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color:
                      newPatientTotal.TotalDiscount > 0
                        ? "warning.main"
                        : "inherit",
                  }}
                >
                  {formatNumber(newPatientTotal.TotalDiscount)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatNumber(newPatientTotal.TotalAmount)}
                </TableCell>
              </TableRow>

              {/* Totals Old Patient Row */}
              <TableRow
                sx={{
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 600 }}>
                  Total Old Patient
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatNumber(oldPatientTotal.TotalPatient)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatNumber(oldPatientTotal.TotalVisitingAmount)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    color:
                      oldPatientTotal.TotalDiscount > 0
                        ? "warning.main"
                        : "inherit",
                  }}
                >
                  {formatNumber(oldPatientTotal.TotalDiscount)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatNumber(oldPatientTotal.TotalAmount)}
                </TableCell>
              </TableRow>

              {/* Overall Totals Row */}
              <TableRow
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    py: 2.5,
                  }}
                >
                  Overall Total
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    py: 2.5,
                  }}
                >
                  {formatNumber(totals.TotalPatient)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    py: 2.5,
                  }}
                >
                  {formatNumber(totals.TotalVisitingAmount)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    py: 2.5,
                  }}
                >
                  {formatNumber(totals.TotalDiscount)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    py: 2.5,
                  }}
                >
                  {formatNumber(totals.TotalAmount)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}
