import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Divider,
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
import { useAssistantRegistrationMutation } from "../../redux/api/user.API";
import { toast } from "sonner";
import { getResponse } from "../../utils/getResponst";

const schema = z.object({
    userName: z.string().min(3, "User name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ASSISTANT", "ADMIN", "DOCTOR"]),
    name: z.string().min(3, "Name must be at least 3 characters"),
    fatherName: z.string().min(1, "Father's name is required"),
    motherName: z.string().min(1, "Mother's name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    sex: z.enum(["MALE", "FEMALE", "OTHER"]),
    contactNumber: z.string().min(11, "Invalid contact number"),
});

type FormData = z.infer<typeof schema>;

interface CreateAssistantFormProps {
    onCancel?: () => void;
}

export default function CreateAssistantForm({ onCancel }: CreateAssistantFormProps) {

    const [assistantRegistration, { isLoading }] = useAssistantRegistrationMutation()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            role: "ASSISTANT",
            sex: "MALE",
        }
    });

    const onSubmit = async (data: FormData) => {
        const res = await assistantRegistration(data)
        const result = await getResponse(res)
        console.log(result);
        if (result?.success) {
            toast.success(result.message);
            onCancel?.();
        } else {
            toast.error(result?.message);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Add New Assistant
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    {/* User Account Information */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#3b82f6", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Account Information
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                {...register("userName")}
                                error={!!errors.userName}
                                helperText={errors.userName?.message}
                            />
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <TextField
                                fullWidth
                                label="Role"
                                type="role"
                                variant="outlined"
                                focused
                                {...register("role")}
                                defaultValue="ASSISTANT"
                                disabled
                                error={!!errors.role}
                                helperText={errors.role?.message}
                            />


                        </Box>
                    </Box>

                    <Divider />

                    {/* Personal Information */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#3b82f6", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Personal Information
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
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
                                label="Contact Number"
                                variant="outlined"
                                {...register("contactNumber")}
                                error={!!errors.contactNumber}
                                helperText={errors.contactNumber?.message}
                            />
                            <TextField
                                fullWidth
                                label="Father's Name"
                                variant="outlined"
                                {...register("fatherName")}
                                error={!!errors.fatherName}
                                helperText={errors.fatherName?.message}
                            />
                            <TextField
                                fullWidth
                                label="Mother's Name"
                                variant="outlined"
                                {...register("motherName")}
                                error={!!errors.motherName}
                                helperText={errors.motherName?.message}
                            />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                variant="outlined"
                                focused
                                {...register("dateOfBirth")}
                                error={!!errors.dateOfBirth}
                                helperText={errors.dateOfBirth?.message}
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
                            Save Assistant
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}
