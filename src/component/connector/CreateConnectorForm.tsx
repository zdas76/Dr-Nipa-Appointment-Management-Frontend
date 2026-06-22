import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useConnectorRegistrationMutation } from "../../redux/api/connectorAPI";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";

const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    contactNumber: z.string().min(11, "Invalid contact number").max(11, "Invalid contact number").regex(/^\d+$/, "Invalid contact number"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    diagnosticName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateConnectorFormProps {
    onCancel?: () => void;
}

export default function CreateConnectorForm({ onCancel }: CreateConnectorFormProps) {
    const [submitConnector, { isLoading }] = useConnectorRegistrationMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        const res = await submitConnector(data).unwrap();
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
                Add New Connector
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#3b82f6", mb: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Connector Details
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
                                label="Email Address (Optional)"
                                type="email"
                                variant="outlined"
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                fullWidth
                                label="Diagnostic Name (Optional)"
                                variant="outlined"
                                {...register("diagnosticName")}
                                error={!!errors.diagnosticName}
                                helperText={errors.diagnosticName?.message}
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
                            {isLoading ? "Saving..." : "Save Connector"}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}
