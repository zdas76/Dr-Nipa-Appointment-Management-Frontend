/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useChangePasswordMutation } from "../../redux/api/authApi";


// Validation schema for password change
const schema = z.object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

type FormData = z.infer<typeof schema>;

export default function ChangePassword() {
    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }).unwrap();
            toast.success("Password changed successfully");
            reset();
        } catch (error: any) {
            if (error?.data?.success === false) {
                toast.error(error?.data?.message);
            } else {
                toast.error("Failed to change password");
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}>
                Change Password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <Controller
                        name="currentPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Current Password"
                                error={!!errors.currentPassword}
                                helperText={errors.currentPassword?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="newPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="New Password"
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="password"
                                label="Confirm New Password"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                fullWidth
                            />
                        )}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    >
                        {isLoading ? "Updating..." : "Change Password"}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
