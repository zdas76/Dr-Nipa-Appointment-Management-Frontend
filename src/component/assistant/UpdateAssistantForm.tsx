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
import { useUpdateAssistantMutation } from "../../redux/api/assistantAPI";
import { toast } from "sonner";
import { getResponse } from "../../utils/getResponst";
import type { TAssistant } from "../../types/User";

const schema = z.object({
    name: z.string().optional().nullable(),
    fatherName: z.string().optional().nullable(),
    motherName: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    sex: z.enum(["MALE", "FEMALE", "OTHER"]).optional().nullable(),
    contactNumber: z.string().optional().nullable(),
});

export type TUpdateAssistant = z.infer<typeof schema>;

interface UpdateAssistantFormProps {
    data: TAssistant;
    onCancel?: () => void;
}

export default function UpdateAssistantForm({ data, onCancel }: UpdateAssistantFormProps) {
    const [updateAssistant, { isLoading }] = useUpdateAssistantMutation();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TUpdateAssistant>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || "",
            fatherName: data?.fatherName || "",
            motherName: data?.motherName || "",
            dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : "",
            sex: data?.sex,
            contactNumber: data?.contactNumber || "",
        }
    });

    const onSubmit = async (formData: TUpdateAssistant) => {
        try {
            const res = await updateAssistant({ id: data?.id as number, data: formData });
            const result = await getResponse(res);
            if (result?.success) {
                toast.success(result.message);
                onCancel?.();
            }
        } catch (error) {
            toast.error("An error occurred while updating");
            console.error(error);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 0, borderRadius: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Update Assistant Info
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
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
                            Update Assistant
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}
