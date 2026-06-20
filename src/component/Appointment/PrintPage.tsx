import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import type { TAppointment } from '../../types/User'
import dayjs from 'dayjs'
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function PrintPage({ appointmentData, onCancel }: { appointmentData: TAppointment, onCancel: () => void }) {

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef })

    return (
        <Box>
            <Box ref={contentRef} sx={{ width: 390, padding: 1, }}>
                <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                    <Stack>
                        <Typography sx={{ fontWeight: 700 }}>DR. NAHIDA ISLAM NIPA</Typography>
                        <Typography sx={{ fontWeight: 700 }}>Associate Professor <br /> & Head of Department</Typography>
                        <Divider />
                        <br />
                        <Typography>Patient Name: {appointmentData?.patientInfo?.name}</Typography>
                        <Typography>Contact Number: {appointmentData?.patientInfo?.contactNumber}</Typography>
                        <Typography>Gender: {appointmentData?.patientInfo?.sex}</Typography>
                        <Typography>Visiting Date: {dayjs(appointmentData?.visitingDate).format("DD-MM-YYYY")}</Typography>
                        <Typography>Visiting Time: {appointmentData?.visitingTime}</Typography>
                        <Typography>Visiting Fee: {appointmentData?.visitingFee}</Typography>
                    </Stack>
                </Stack>
            </Box>

            <Stack sx={{ mt: 10, display: "flex", justifyContent: "flex-end", gap: 3 }} direction="row">
                <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                <Button variant="contained" onClick={reactToPrintFn}>Print</Button>
            </Stack>
        </Box>
    )
}
