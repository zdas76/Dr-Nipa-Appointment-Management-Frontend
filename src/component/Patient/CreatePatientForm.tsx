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
import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { usePatientRegistrationMutation } from "../../redux/api/patientAPI";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";
import { useState } from "react";

const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    age: z.string().min(1, "Age is required!"),
    sex: z.enum(["MALE", "FEMALE", "OTHER"]),
    contactNumber: z.string().min(11, "Invalid contact number"),
    address: z.string().min(1, "Address is required!"),
});

type FormData = z.infer<typeof schema>;

interface CreatePatientFormProps {
    onCancel?: () => void;
}

export default function CreatePatientForm({ onCancel }: CreatePatientFormProps) {

    const [ageValue, setAgeValue] = useState("");
    const [ageUnit, setAgeUnit] = useState("Years");

    const valueOptions = ["Days", "Months", "Years"];

    const [submitPatient, { isLoading }] = usePatientRegistrationMutation();
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
            sex: "MALE",
        }
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {

        const age = ageValue + " " + ageUnit;
        data.age = age;

        const res = await submitPatient(data).unwrap();
        const result = getResponse(res);
        if (result.success) {
            toast.success(result.message);
            reset();
            onCancel?.();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Add New Patient
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <Box>

                        <Box className="gap-4 flex flex-col ">
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />

                            <Box className="flex items-center gap-2">
                                <TextField
                                    fullWidth
                                    label="Age"
                                    focused
                                    variant="outlined"
                                    onChange={(e) => {
                                        setAgeValue(e.target.value);
                                        setValue("age", e.target.value); // keep RHF in sync for Zod validation
                                    }}
                                    error={!!errors.age}
                                    helperText={errors.age?.message}
                                />
                                <Select label="Age Unit" defaultValue="Years" onChange={(e) => setAgeUnit(e.target.value as string)}>
                                    {valueOptions.map((unit) => (
                                        <MenuItem key={unit} value={unit}>
                                            {unit}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>

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

                            <TextField
                                fullWidth
                                label="Contact Number"
                                variant="outlined"
                                {...register("contactNumber")}
                                error={!!errors.contactNumber}
                                helperText={errors.contactNumber?.message}
                            />

                            <TextField
                                fullWidth
                                label="Address"
                                variant="outlined"
                                multiline
                                rows={2}
                                sx={{ gridColumn: { md: "span 2" } }}
                                {...register("address")}
                                error={!!errors.address}
                                helperText={errors.address?.message}
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
                            {isLoading ? "Saving..." : "Save Patient"}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper >
    );
}
