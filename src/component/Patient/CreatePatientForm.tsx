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

const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    age: z.number({ message: "Age must be a number" }).min(1, "Age must be a positive number"),
    sex: z.enum(["MALE", "FEMALE", "OTHER"]),
    contactNumber: z.string().min(11, "Invalid contact number"),
    address: z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof schema>;

interface CreatePatientFormProps {
    onCancel?: () => void;
}

export default function CreatePatientForm({ onCancel }: CreatePatientFormProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            sex: "MALE",
        }
    });

    const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log("Patient Data Submitted:", data);
        // Handle submission logic (e.g., API call) here
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Add New Patient
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#3b82f6", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Patient Information
                        </Typography>
                        <Box className="grid gap-4 grid-cols-1 lg:grid-cols-1">
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                {...register("name")}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                            <TextField
                                fullWidth
                                label="Age"
                                type="number"
                                variant="outlined"
                                {...register("age", { valueAsNumber: true })}
                                error={!!errors.age}
                                helperText={errors.age?.message}
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
                            Save Patient
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}
