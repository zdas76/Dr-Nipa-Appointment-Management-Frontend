import { zodResolver } from "@hookform/resolvers/zod";
import {
    Autocomplete,
    Box,
    Button,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useGetAllPatientSearchQuery } from "../../redux/api/patientAPI";
import { useGetAllConnectorQuery } from "../../redux/api/connectorAPI";
import { useCreateAppointmentMutation, useGetLastAppointmentDateQuery } from "../../redux/api/appointment";
import type { TConnector, TPatient } from "../../types/User";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useGetDoctorInforQuery } from "../../redux/api/doctorAPI";

const schema = z.object({
    patientId: z.number({ message: "Patient ID is required" }).min(1),
    visitingDate: z.string().min(1, "Visiting date is required"),
    patientType: z.enum(["NEW", "OLD"]),
    visitingTime: z.string().optional(),
    connectorId: z.number().optional().nullable(),
    visitingFee: z.number().optional().nullable(),
    weight: z.number().optional().nullable(),
    booldPusher: z.string().optional().nullable(),
    bloodGroup: z.string().optional().nullable(),
    discount: z.number().optional().nullable(),
});

type FormData = z.infer<typeof schema>;

interface CreateAppointmentFormProps {
    onCancel?: () => void;
}

export default function CreateAppointmentForm({ onCancel }: CreateAppointmentFormProps) {

    const [searchPatient, setSearchPatient] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data: patients, isLoading: isPatientsLoading } = useGetAllPatientSearchQuery(debouncedSearch, { skip: !debouncedSearch });
    const { data: connectors, isLoading: isConnectorsLoading } = useGetAllConnectorQuery(undefined);
    const { data: doctors, isLoading: isDoctorLoading } = useGetDoctorInforQuery([]);
    const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

    const doctorinfo = doctors?.data[0];
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
            patientType: "NEW",
        }
    });

    const patientId = watch("patientId");
    const vDate = watch("visitingDate");

    const { data: lastAppointments } = useGetLastAppointmentDateQuery(patientId, { skip: !patientId });

    useEffect(() => {
        const lastApptDateStr = lastAppointments?.data?.result?.visitingDate;

        if (lastApptDateStr && vDate && doctorinfo) {
            const lastDate = new Date(lastApptDateStr);
            const visitingDate = new Date(vDate);

            // Calculate total months difference
            const yearDiff = visitingDate.getFullYear() - lastDate.getFullYear();
            const monthDiff = visitingDate.getMonth() - lastDate.getMonth();

            const totalMonths = yearDiff * 12 + monthDiff;

            // Optional: check exact day difference
            const isExceeded =
                totalMonths > 3 ||
                (totalMonths === 3 && visitingDate.getDate() >= lastDate.getDate());

            if (isExceeded) {
                setValue("patientType", "OLD");
                setValue("visitingFee", doctorinfo?.oldPatientVisitingFee);
            } else {
                setValue("patientType", "NEW");
                setValue("visitingFee", doctorinfo?.newPatientVisitingFee);
            }
        } else {
            setValue("patientType", "NEW");
            setValue("visitingFee", doctorinfo?.newPatientVisitingFee);
        }
    }, [lastAppointments, vDate, doctorinfo, setValue]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearch(searchPatient);
        }, 1000);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchPatient]);


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const res = await createAppointment(data).unwrap();
            const result = getResponse(res);
            if (result.success) {
                toast.success(result.message);
                reset();
                onCancel?.();
            } else {
                toast.error(result.message);
            }
        } catch {
            toast.error("Failed to create appointment");
        }
    };

    if (isDoctorLoading || isPatientsLoading || isConnectorsLoading) {
        return <div>Loading...</div>;
    }

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
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr " }, gap: 3 }}>
                            <Controller
                                name="patientId"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Autocomplete
                                        options={patients?.data || []}
                                        getOptionLabel={(option: TPatient) => `${option.name} (${option.contactNumber})`}
                                        loading={isPatientsLoading}
                                        value={patients?.data?.find((p: TPatient) => p.id === value) || null}
                                        onChange={(_, newValue) => {
                                            onChange(newValue ? newValue.id : null);
                                        }}

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Patient"
                                                onChange={(e) => {
                                                    setSearchPatient(e.target.value)
                                                }}
                                                error={!!errors.patientId}
                                                helperText={errors.patientId?.message}
                                            />
                                        )}
                                    />
                                )}
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

                            <Controller
                                name="connectorId"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Autocomplete
                                        options={connectors?.data || []}
                                        getOptionLabel={(option: TConnector) => `${option.name} (${option.diagnosticName || "No Diagnostic"})`}
                                        loading={isConnectorsLoading}
                                        value={connectors?.data?.find((c: TConnector) => c.id === value) || null}
                                        onChange={(_, newValue) => {
                                            onChange(newValue ? newValue.id : null);
                                            if (newValue) {
                                                // Automatically set visiting fee if it's a new patient (as a default)
                                                setValue("visitingFee", newValue.newPatientAmount);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Connector (Optional)"
                                                error={!!errors.connectorId}
                                                helperText={errors.connectorId?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
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
                            {isLoading ? "Saving..." : "Save Appointment"}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}
