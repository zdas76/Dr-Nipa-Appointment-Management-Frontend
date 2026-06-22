import { useUpdateAppointmentMutation, useGetAppointmentByIdQuery, useGetLastVisitingDateQuery } from "../../redux/api/appointment";
import {
    Autocomplete,
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
import { Controller, useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";
import { useEffect } from "react";
import { useGetDoctorInforQuery } from "../../redux/api/doctorAPI";
import { FrontLoader } from "@mui/icons-material";
import dayjs from "dayjs";
import { useGetAllConnectorQuery } from "../../redux/api/connectorAPI";
import type { TConnector } from "../../types/User";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    patientId: z.number({ message: "Patient ID is required" }).min(1),
    visitingDate: z.string().min(1, "Visiting date is required"),
    patientType: z.enum(["NEW", "OLD"]),
    visitingTime: z.string().optional(),
    weight: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().optional()),
    booldPusher: z.string().optional(),
    visitingFee: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().optional()),
    discount: z.preprocess((val) => (val === "" || val === null || val === undefined ? undefined : Number(val)), z.number().optional()),
    bloodGroup: z.string().optional(),
    paymentStatus: z.enum(["PAID", "UNPAID", "PARTIALLY_PAID"]),
    connectorId: z.number().optional(),
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

    const { data: connectors, isLoading: isConnectorsLoading } = useGetAllConnectorQuery({});

    const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();

    const { data: lastVisitingDateInfo, isLoading: isLastVisitingDateLoading } = useGetLastVisitingDateQuery(data?.patientId as number, { skip: !data?.patientId, refetchOnMountOrArgChange: true });
    const lastVisitingDate = lastVisitingDateInfo?.data;



    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<z.input<typeof schema>, FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            patientId: data?.patientId || 0,
            visitingDate: data?.visitingDate || "",
            patientType: data?.patientType || "NEW",
            visitingTime: data?.visitingTime || "",
            booldPusher: data?.booldPusher || "",
            visitingFee: data?.visitingFee,
            bloodGroup: data?.bloodGroup || "",
            paymentStatus: data?.paymentStatus || "UNPAID",
            connectorId: data?.connectorId || undefined,
        }
    });


    useEffect(() => {
        if (data) {
            let formattedDate = "";
            if (data.visitingDate) {
                try {
                    formattedDate = new Date(data.visitingDate).toISOString().split('T')[0];
                } catch {
                    formattedDate = data.visitingDate.substring(0, 10);
                }
            }

            reset({
                patientId: data.patientId,
                connectorId: data.connectorId || undefined,
                visitingDate: formattedDate,
                patientType: data.patientType,
                visitingTime: data.visitingTime || "",
                weight: data.weight || undefined,
                booldPusher: data.booldPusher || "",
                visitingFee: data.visitingFee || undefined,
                discount: data.discount || undefined,
                bloodGroup: data.bloodGroup || "",
                paymentStatus: data.paymentStatus ?? "UNPAID",
            });
        }
    }, [data, reset]);

    const vDate = useWatch({
        control,
        name: "visitingDate",
    });

    // Fetch last appointment date for patient


    useEffect(() => {
        if (vDate && lastVisitingDate) {
            const expirationDate = dayjs(lastVisitingDate).add(3, "month");
            const isAfter = dayjs(vDate).isAfter(expirationDate);

            if (!isAfter) {
                setValue("patientType", "OLD");
                setValue("visitingFee", doctorinfo?.oldPatientVisitingFee);
            } else {
                setValue("patientType", "NEW");
                setValue("visitingFee", doctorinfo?.newPatientVisitingFee);
            }
        }

    }, [lastVisitingDate, vDate, setValue, doctorinfo]);

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

    if (appIsLoading || isDoctorLoading || isConnectorsLoading || isLastVisitingDateLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <FrontLoader />
            </Box>
        );
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
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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
                                    variant="outlined"
                                    {...register("weight")}
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
                                    variant="outlined"
                                    {...register("discount")}
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

                                <FormControl fullWidth error={!!errors.paymentStatus}>
                                    <InputLabel>Payment Status</InputLabel>
                                    <Controller
                                        name="paymentStatus"
                                        control={control}
                                        defaultValue="UNPAID"
                                        render={({ field }) => (
                                            <Select {...field} label="Payment Status">
                                                {["PAID", "UNPAID", "PARTIALLY_PAID"].map((status) => (
                                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>

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
                                                onChange(newValue ? newValue.id : undefined);
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
                                {isLoading ? "Updating..." : "Update Appointment"}
                            </Button>
                        </Box>
                    </Stack>
                </form>
            )}
        </Paper>
    );
}
