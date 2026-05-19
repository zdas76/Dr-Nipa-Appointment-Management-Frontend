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
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useUpdateAppointmentMutation, useGetLastAppointmentDateQuery, useGetAppointmentByIdQuery } from "../../redux/api/appointment";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";
import { useEffect } from "react";
import { useGetDoctorInforQuery } from "../../redux/api/doctorAPI";
import { FrontLoader } from "@mui/icons-material";

const schema = z.object({
    patientId: z.number({ message: "Patient ID is required" }).min(1),
    visitingDate: z.string().min(1, "Visiting date is required"),
    patientType: z.enum(["NEW", "OLD"]),
    visitingTime: z.string().optional(),
    weight: z.number().optional().nullable(),
    booldPusher: z.string().optional().nullable(),
    visitingFee: z.number().optional().nullable(),
    discount: z.number().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface UpdateAppointmentFormProps {
    id: number;
    onCancel?: () => void;
}

export default function UpdateAppointmentForm({ id, onCancel }: UpdateAppointmentFormProps) {
    const { data: appData, isLoading: appIsLoading } = useGetAppointmentByIdQuery(id);
    const data = appData?.data;

    const { data: doctors, isLoading: isDoctorLoading } = useGetDoctorInforQuery([]);
    const doctorinfo = doctors?.data[0];

    const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            patientId: 0,
            visitingDate: "",
            patientType: "NEW",
            visitingTime: "",
            weight: null,
            booldPusher: "",
            visitingFee: null,
            discount: null,
            bloodGroup: "",
        }
    });

    useEffect(() => {
        if (data) {
            // Ensure date is formatted as YYYY-MM-DD for the input type="date"
            let formattedDate = "";
            if (data.visitingDate) {
                try {
                    // This handles ISO strings or parseable date strings safely
                    formattedDate = new Date(data.visitingDate).toISOString().split('T')[0];
                } catch {
                    formattedDate = data.visitingDate.substring(0, 10);
                }
            }

            reset({
                patientId: data.patientId,
                visitingDate: formattedDate,
                patientType: data.patientType,
                visitingTime: data.visitingTime?.substring(0, 5) || "",
                weight: data.weight || null,
                booldPusher: data.booldPusher || "",
                visitingFee: data.visitingFee || null,
                discount: data.discount || null,
                bloodGroup: data.bloodGroup || "",
            });
        }
    }, [data, reset]);

    const patientId = watch("patientId");
    const vDate = watch("visitingDate");

    const { data: lastAppointments } = useGetLastAppointmentDateQuery(patientId, { skip: !patientId });

    useEffect(() => {
        const lastApptDateStr = lastAppointments?.data?.result?.visitingDate;

        if (lastApptDateStr && vDate && doctorinfo) {
            const lastDate = new Date(lastApptDateStr);
            const visitingDate = new Date(vDate);

            const yearDiff = visitingDate.getFullYear() - lastDate.getFullYear();
            const monthDiff = visitingDate.getMonth() - lastDate.getMonth();

            const totalMonths = yearDiff * 12 + monthDiff;

            const isExceeded =
                totalMonths > 3 ||
                (totalMonths === 3 && visitingDate.getDate() >= lastDate.getDate());

            if (isExceeded) {
                setValue("patientType", "NEW");
                setValue("visitingFee", doctorinfo?.newPatientVisitingFee);

            } else {
                setValue("patientType", "OLD");
                setValue("visitingFee", doctorinfo?.oldPatientVisitingFee);
            }
        } else if (lastApptDateStr === null) {
            setValue("patientType", "NEW");
            setValue("visitingFee", doctorinfo?.newPatientVisitingFee);
        }
    }, [lastAppointments, vDate, doctorinfo, setValue]);

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        if (!data) return;
        try {
            const res = await updateAppointment({ id: data.id, ...formData }).unwrap();
            const result = getResponse(res);
            if (result.success) {
                toast.success(result.message || "Appointment updated successfully");
                reset();
                onCancel?.();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to update appointment");
        }
    };

    if (isDoctorLoading) {
        return <FrontLoader />
    }
    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Update Appointment
            </Typography>

            {appIsLoading || !data ? (
                <Box sx={{ py: 4, textAlign: "center" }}><Typography>Loading appointment data...</Typography></Box>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={4}>
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#3b82f6", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Appointment Information
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr " }, gap: 3 }}>

                                <TextField
                                    fullWidth
                                    label="Patient Name"
                                    value={data.patientInfo?.name || data.patient?.name || "Unknown Patient"}
                                    variant="outlined"
                                    disabled
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

                                <Controller
                                    name="patientType"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            label="Patient Type"
                                            error={!!errors.patientType}
                                            helperText={errors.patientType?.message}
                                            disabled
                                        >
                                            <MenuItem value={"NEW"}>NEW Patient</MenuItem>
                                            <MenuItem value={"OLD"}>OLD Patient</MenuItem>
                                        </TextField>
                                    )}
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
                                <TextField
                                    fullWidth
                                    label="Visiting Fee"
                                    type="number"
                                    variant="outlined"
                                    disabled
                                    {...register("visitingFee", { valueAsNumber: true })}
                                    error={!!errors.visitingFee}
                                    helperText={errors.visitingFee?.message}
                                />
                                <TextField
                                    fullWidth
                                    label="Discount"
                                    type="number"
                                    variant="outlined"
                                    {...register("discount", { valueAsNumber: true })}
                                    error={!!errors.discount}
                                    helperText={errors.discount?.message}
                                />

                                <FormControl fullWidth error={!!errors.bloodGroup}>
                                    <InputLabel>Blood Group</InputLabel>
                                    <Controller
                                        name="bloodGroup"
                                        control={control}
                                        defaultValue=""
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
                                disabled={isLoading}
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
                                {isLoading ? "Updating..." : "Update Appointment"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            )}
        </Paper>
    );
}
