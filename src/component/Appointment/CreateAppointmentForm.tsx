import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  useCreateAppointmentMutation,
  useGetLastVisitingDateQuery,
} from "../../redux/api/appointment";
import { useGetAllConnectorQuery } from "../../redux/api/connectorAPI";
import {
  useGetAllPatientSearchQuery,
  useGetPatientByIdQuery,
} from "../../redux/api/patientAPI";
import type { TConnector, TPatient } from "../../types/User";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useGetDoctorInforQuery } from "../../redux/api/doctorAPI";
import dayjs from "dayjs";
import { SearchOffSharp } from "@mui/icons-material";
import { useSendSmsMutation } from "../../redux/api/sms";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  sex: z.enum(["MALE", "FEMALE", "OTHER"]),
  contactNumber: z.string().min(11, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  patientId: z.number().optional(),
  visitingDate: z.string().min(1, "Visiting date is required"),
  patientType: z.enum(["NEW", "OLD"]),
  visitingTime: z.string().optional(),
  connectorId: z.number().optional(),
  visitingFee: z.number().optional(),
  weight: z.number().optional(),
  booldPusher: z.string().optional(),
  bloodGroup: z.string().optional(),
  discount: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateAppointmentFormProps {
  onCancel?: () => void;
}

export default function CreateAppointmentForm({
  onCancel,
}: CreateAppointmentFormProps) {
  const [defaultPatientId, setDefaultPatientId] = useState<number | null>(null);
  const [searchPatient, setSearchPatient] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [ageUnit, setAgeUnit] = useState("YEARS");

  const [patientId, setPatientId] = useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<TPatient | null>(null);
  const [patientInputValue, setPatientInputValue] = useState("");
  const { data: patients, isLoading: isPatientsLoading } =
    useGetAllPatientSearchQuery(debouncedSearch, { skip: !debouncedSearch });
  const { data: connectors, isLoading: isConnectorsLoading } =
    useGetAllConnectorQuery(undefined);
  const { data: doctors, isLoading: isDoctorLoading } = useGetDoctorInforQuery(
    [],
  );
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const [sendSms] = useSendSmsMutation();

  const { data: patientData } = useGetPatientByIdQuery(patientId as number, {
    skip: !patientId,
    refetchOnMountOrArgChange: true,
  });
  const patientInfo = patientData?.data;

  const { data: lastVisitingDateInfo, isLoading: isLastVisitingDateLoading } =
    useGetLastVisitingDateQuery(patientId as number, {
      skip: !patientId,
      refetchOnMountOrArgChange: true,
    });
  const lastVisitingDate = lastVisitingDateInfo?.data;

  const doctorinfo = doctors?.data[0];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      patientType: "NEW",
      visitingTime: dayjs().hour(16).minute(0).format("HH:mm"),
      name: "",
      age: "",
      sex: "MALE",
      contactNumber: "",
      address: "",
      patientId: undefined,
    },
  });

  const vDate = useWatch({
    control,
    name: "visitingDate",
  });

  useEffect(() => {
    if (patientInfo) {
      setValue("name", patientInfo?.name);
      if (patientInfo?.age) {
        const ageParts = patientInfo.age.trim().split(" ");
        if (ageParts.length >= 2) {
          const value = ageParts[0];
          const unit = ageParts.slice(1).join(" ");
          // eslint-disable-next-line
          setAgeValue(value);
          setAgeUnit(unit);
          setValue("age", `${value} ${unit}`);
        }
      }
      setValue("sex", patientInfo?.sex);
      setValue("contactNumber", patientInfo?.contactNumber);
      setValue("address", patientInfo?.address);
      setValue("patientId", patientInfo?.patientId);
    } else {
      setValue("name", "");
      setValue("age", "");
      setValue("sex", "FEMALE");
      setValue("address", "");
      setValue("patientId", undefined);
    }
  }, [patientInfo, setValue]);

  useEffect(() => {
    if (lastVisitingDate && vDate) {
      const expirationDate = dayjs(lastVisitingDate).add(3, "month");

      const isAfter = dayjs(vDate).isAfter(expirationDate);

      if (isAfter) {
        setValue("patientType", "NEW");
        setValue("visitingFee", doctorinfo?.newPatientVisitingFee);
      } else {
        setValue("patientType", "OLD");
        setValue("visitingFee", doctorinfo?.oldPatientVisitingFee);
      }
    } else {
      setValue("patientType", "NEW");
      setValue("visitingFee", doctorinfo?.newPatientVisitingFee);
    }
  }, [lastVisitingDate, vDate, setValue, doctorinfo]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchPatient.length >= 5) {
        setDebouncedSearch(searchPatient);
      } else {
        setDebouncedSearch("");
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchPatient]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const age = ageValue + " " + ageUnit;

    const res = await createAppointment({ ...data, age });
    const result = getResponse(res);

    if (result.success === true) {
      toast.success(result.message);

      const dayName = dayjs(result.data.visitingDate).format("dddd");

      const appointmentInfo = {
        contactNumber: result?.data?.patientInfo.contactNumber,
        appointmentId: result.data.id,
      };
      const messageContent = `Appointment For Dr. Nahida Islam Nipa, Patient: ${result?.data?.patientInfo.name}, date: ${dayjs(result.data.visitingDate).format("DD-MMM-YYYY")} - ${dayName} , ID# ${result.data.patientId}, Please Attend 4:00 pm to 9:00 pm, Room: 301 (3rd Floor), Delta Health Care, Medical College Gate, Mymensingh. any query: 01777-016179`;

      await sendSms({ appointmentInfo: [appointmentInfo], messageContent });

      reset();
      setSelectedPatient(null);
      setPatientInputValue("");
      onCancel?.();
    }
  };
  if (isDoctorLoading || isLastVisitingDateLoading) {
    return <CircularProgress color="primary" />;
  }

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, borderRadius: 4, border: "1px solid #e2e8f0" }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}
      >
        Add New Appointment
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 800,
                color: "#3b82f6",
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Appointment Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box className="flex items-center gap-2">
                <TextField
                  fullWidth
                  label="Patient Id"
                  variant="outlined"
                  type="number"
                  name="patientId"
                  onChange={(e) => setDefaultPatientId(Number(e.target.value))}
                />

                <SearchOffSharp
                  sx={{ fontSize: 55 }}
                  className="text-white cursor-pointer p-2 bg-green-500 rounded-xl"
                  onClick={() => setPatientId(defaultPatientId)}
                />
              </Box>

              <Controller
                name="contactNumber"
                control={control}
                render={({ field: { onChange } }) => (
                  <Autocomplete<TPatient, false, false, true>
                    freeSolo
                    options={patients?.data || []}
                    getOptionLabel={(option: TPatient | string) => {
                      if (typeof option === "string") {
                        return option;
                      }
                      return `${option.name} (${option.contactNumber})`;
                    }}
                    loading={isPatientsLoading}
                    value={selectedPatient}
                    inputValue={patientInputValue}
                    onInputChange={(_, newInputValue, reason) => {
                      if (reason === "input") {
                        onChange(newInputValue);
                        setSearchPatient(newInputValue);
                        setPatientInputValue(newInputValue);
                        setSelectedPatient(null);
                        setPatientId(null);
                      } else if (reason === "clear") {
                        onChange("");
                        setSearchPatient("");
                        setPatientInputValue("");
                        setSelectedPatient(null);
                      }
                    }}
                    onChange={(_, newValue) => {
                      if (typeof newValue === "string") {
                        onChange(newValue);
                        setPatientInputValue(newValue);
                      } else if (newValue && typeof newValue === "object") {
                        onChange(newValue.contactNumber);
                        setPatientId(newValue.patientId);
                        setSelectedPatient(newValue);
                        setPatientInputValue(
                          `${newValue.name} (${newValue.contactNumber})`,
                        );
                      } else {
                        onChange("");
                        setSelectedPatient(null);
                        setPatientInputValue("");
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Contact Number"
                        error={!!errors.contactNumber}
                        helperText={errors.contactNumber?.message}
                      />
                    )}
                  />
                )}
              />

              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                focused
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <FormControl fullWidth error={!!errors.sex}>
                <InputLabel>Sex</InputLabel>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Sex">
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <Box className="flex items-center gap-2">
                <TextField
                  fullWidth
                  label="Age"
                  focused
                  defaultValue={ageValue}
                  variant="outlined"
                  onChange={(e) => {
                    setAgeValue(e.target.value);
                    setValue("age", `${e.target.value} ${ageUnit}`);
                  }}
                  error={!!errors.age}
                  helperText={errors.age?.message}
                />
                <Select
                  label="Age Unit"
                  defaultValue={ageUnit}
                  onChange={(e) => setAgeUnit(e.target.value as string)}
                >
                  <MenuItem value="YEARS">Years</MenuItem>
                  <MenuItem value="MONTHS">Months</MenuItem>
                  <MenuItem value="DAYS">Days</MenuItem>
                </Select>
              </Box>

              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                multiline
                focused
                rows={2}
                sx={{ gridColumn: { md: "span 2" } }}
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message}
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
                    defaultValue=""
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
                    getOptionLabel={(option: TConnector) =>
                      `${option.name} (${option.diagnosticName || "No Diagnostic"})`
                    }
                    loading={isConnectorsLoading}
                    value={
                      connectors?.data?.find(
                        (c: TConnector) => c.id === value,
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      onChange(newValue ? newValue.id : null);
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

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
              }}
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
                "&:hover": { bgcolor: "#2563eb" },
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
