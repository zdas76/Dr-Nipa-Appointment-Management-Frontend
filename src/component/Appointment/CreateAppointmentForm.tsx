import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    patientId: z.number({ message: "Patient ID is required" }).min(1),
    visitingDate: z.string().min(1, "Visiting date is required"),
    visitingTime: z.string().optional(),
    connectorId: z.number().optional().nullable(),
    visitingFee: z.number().optional().nullable(),
    weight: z.number().optional().nullable(),
    booldPusher: z.string().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface CreateAppointmentFormProps {
    onCancel?: () => void;
}

export default function CreateAppointmentForm({ onCancel }: CreateAppointmentFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            bloodGroup: "A+",
        }
    });

    const onSubmit = (data: FormData) => {
        console.log("Appointment Data Submitted:", data);
        // Handle submission logic (e.g., API call) here
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Add New Appointment
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#3b82f6", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Appointment Information
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Patient ID"
                                type="number"
                                variant="outlined"
                                {...register("patientId", { valueAsNumber: true })}
                                error={!!errors.patientId}
                                helperText={errors.patientId?.message}
                            />
                            <TextField
                                fullWidth
                                label="Visiting Date"
                                type="date"
                                variant="outlined"
                                focused
                                {...register("visitingDate")}
                                error={!!errors.visitingDate}
                                helperText={errors.visitingDate?.message}
                            />
                            <TextField
                                fullWidth
                                label="Visiting Time (Optional)"
                                type="time"
                                variant="outlined"
                                focused
                                {...register("visitingTime")}
                                error={!!errors.visitingTime}
                                helperText={errors.visitingTime?.message}
                            />
                            <TextField
                                fullWidth
                                label="Connector ID (Optional)"
                                type="number"
                                variant="outlined"
                                {...register("connectorId", { valueAsNumber: true })}
                                error={!!errors.connectorId}
                                helperText={errors.connectorId?.message}
                            />
                            <TextField
                                fullWidth
                                label="Visiting Fee"
                                type="number"
                                variant="outlined"
                                {...register("visitingFee", { valueAsNumber: true })}
                                error={!!errors.visitingFee}
                                helperText={errors.visitingFee?.message}
                            />
                            <TextField
                                fullWidth
                                label="Weight (kg)"
                                type="number"
                                variant="outlined"
                                {...register("weight", { valueAsNumber: true })}
                                error={!!errors.weight}
                                helperText={errors.weight?.message}
                            />
                            <TextField
                                fullWidth
                                label="Blood Pressure (booldPusher)"
                                variant="outlined"
                                {...register("booldPusher")}
                                error={!!errors.booldPusher}
                                helperText={errors.booldPusher?.message}
                            />
                            <FormControl fullWidth error={!!errors.bloodGroup}>
                                <InputLabel>Blood Group</InputLabel>
                                <Controller
                                    name="bloodGroup"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} label="Blood Group">
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                                                <MenuItem key={group} value={group}>{group}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            sx={{ borderRadius: 2, px: 4, py: 1, textTransform: "none", fontWeight: 700 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 700,
                                bgcolor: "#3b82f6",
                                "&:hover": { bgcolor: "#2563eb" }
                            }}
                        >
                            Save Appointment
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}
