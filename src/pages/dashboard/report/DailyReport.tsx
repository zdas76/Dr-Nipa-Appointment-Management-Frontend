/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, CircularProgress, Container, TextField, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material'
import { useState } from 'react';
import { useGetAppointmentDailyReportByDateQuery } from '../../../redux/api/report';


export default function DailyReport() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const { data: dailyReport, isLoading } = useGetAppointmentDailyReportByDateQuery(date, { skip: !date, refetchOnMountOrArgChange: true });

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    }

    // Define categories to display
    const categories = ["NewPatientFemale", "NewPatientMale", "OldPatientFemale", "OldPatientMale"];

    // Readable labels for categories
    const categoryLabels: Record<string, string> = {
        NewPatientFemale: "New Patient (Female)",
        NewPatientMale: "New Patient (Male)",
        OldPatientFemale: "Old Patient (Female)",
        OldPatientMale: "Old Patient (Male)",
    };

    // Helper to format numbers with commas
    const formatNumber = (num: number | string | undefined) => Number(num ?? 0).toLocaleString();

    // Calculate totals
    const totals = categories.reduce((acc, cat) => {
        const data = (dailyReport as any)?.data?.[cat] || (dailyReport as any)?.[cat] || {};
        const visitingAmount = Number(data?.TotalVisitingAmount ?? 0);
        const connectorAmount = Number(data?.TotalConnectorAmount ?? 0);
        const discount = Number(data?.TotalDiscount ?? 0);

        acc.TotalConnector += Number(data?.TotalConnector ?? 0);
        acc.TotalConnectorAmount += connectorAmount;
        acc.TotalDiscount += discount;
        acc.TotalPatient += Number(data?.TotalPatient ?? 0);
        acc.TotalVisitingAmount += visitingAmount;
        acc.TotalAmount += (visitingAmount - connectorAmount - discount);
        return acc;
    }, {
        TotalConnector: 0,
        TotalConnectorAmount: 0,
        TotalDiscount: 0,
        TotalPatient: 0,
        TotalVisitingAmount: 0,
        TotalAmount: 0
    });

    return (
        <Box>

            <Container maxWidth={false} sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "center", alignItems: "center" }}>
                <Typography>Daily Report</Typography>
            </Container>

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

            {/* Report Table */}
            <Paper elevation={3} sx={{ p: 2, overflowX: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Total Connector</TableCell>
                            <TableCell align="right">Connector Amount</TableCell>
                            <TableCell align="right">Total Discount</TableCell>
                            <TableCell align="right">Total Patient</TableCell>
                            <TableCell align="right">Visiting Amount</TableCell>
                            <TableCell align="right">Grand Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => {
                            const data = dailyReport?.data?.[cat] || dailyReport?.[cat] || {};
                            const visitingAmount = Number(data?.TotalVisitingAmount ?? 0);
                            const connectorAmount = Number(data?.TotalConnectorAmount ?? 0);
                            const discount = Number(data?.TotalDiscount ?? 0);
                            const grandTotal = visitingAmount - connectorAmount - discount;

                            return (
                                <TableRow key={cat}>
                                    <TableCell component="th" scope="row">{categoryLabels[cat] || cat}</TableCell>
                                    <TableCell align="right">{formatNumber(data?.TotalConnector ?? 0)}</TableCell>
                                    <TableCell align="right">{formatNumber(connectorAmount)}</TableCell>
                                    <TableCell align="right">{formatNumber(discount)}</TableCell>
                                    <TableCell align="right">{formatNumber(data?.TotalPatient ?? 0)}</TableCell>
                                    <TableCell align="right">{formatNumber(visitingAmount)}</TableCell>
                                    <TableCell align="right">{formatNumber(grandTotal)}</TableCell>
                                </TableRow>
                            );
                        })}
                        {/* Totals Row */}
                        <TableRow sx={{ '& th, & td': { fontWeight: 'bold' } }}>
                            <TableCell component="th" scope="row">Total</TableCell>
                            <TableCell align="right">{formatNumber(totals.TotalConnector)}</TableCell>
                            <TableCell align="right">{formatNumber(totals.TotalConnectorAmount)}</TableCell>
                            <TableCell align="right">{formatNumber(totals.TotalDiscount)}</TableCell>
                            <TableCell align="right">{formatNumber(totals.TotalPatient)}</TableCell>
                            <TableCell align="right">{formatNumber(totals.TotalVisitingAmount)}</TableCell>
                            <TableCell align="right">{formatNumber(totals.TotalAmount)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>

        </Box>
    )
}
