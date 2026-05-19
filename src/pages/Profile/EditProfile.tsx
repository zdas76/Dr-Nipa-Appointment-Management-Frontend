import {
    Button,
    Grid,
    TextField,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useGetDoctorQuery, useUpdateDoctorMutation } from "../../redux/api/doctorAPI";
import { useEffect } from "react";
import { getResponse } from "../../utils/getResponst";
import { toast } from "sonner";

type ProfileFormValues = {
    nameEnglish?: string;
    nameBangla?: string;
    designation?: string;
    contactNumber?: string;
    newPatientVisitingFee?: number;
    oldPatientVisitingFee?: number;
};

interface EditProfileProps {
    email: string;
    onCancel?: () => void;
}

export default function EditProfile({ email, onCancel }: EditProfileProps) {
    const [updateDoctor, { isLoading }] = useUpdateDoctorMutation();
    const { data: doctor, refetch: refetchDoctor } = useGetDoctorQuery(email);

    const {
        control,
        handleSubmit,
        setValue,
    } = useForm<ProfileFormValues>({
        defaultValues: {
            nameEnglish: "",
            nameBangla: "",
            designation: "",
            contactNumber: "",
            newPatientVisitingFee: 0,
            oldPatientVisitingFee: 0,
        },
    });

    useEffect(() => {
        refetchDoctor()
        if (doctor) {
            setValue("nameEnglish", doctor?.data?.nameEnglish || "");
            setValue("nameBangla", doctor?.data?.nameBangla || "");
            setValue("designation", doctor?.data?.designation || "");
            setValue("contactNumber", doctor?.data?.contactNumber || "");
            setValue("newPatientVisitingFee", doctor?.data?.newPatientVisitingFee || 0);
            setValue("oldPatientVisitingFee", doctor?.data?.oldPatientVisitingFee || 0);
        }
    }, [doctor, setValue, refetchDoctor]);

    const onSubmit = async (data: ProfileFormValues) => {
        console.log(data)
        try {
            const res = await updateDoctor({ email: email, ...data }).unwrap();
            const result = await getResponse(res)
            if (result) {
                toast.success("Profile updated successfully");
                onCancel?.();
                refetchDoctor();
            }


        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="nameEnglish"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label="Name (English)" />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="nameBangla"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label="Name (Bangla)" />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name="designation"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label="Designation" />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="contactNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label="Contact Number" />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="newPatientVisitingFee"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="New Patient Fee"
                                    type="number"
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="oldPatientVisitingFee"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Old Patient Fee"
                                    type="number"
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onCancel}
                    sx={{ px: 3, borderRadius: 2, fontWeight: 700 }}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    sx={{ px: 3, borderRadius: 2, fontWeight: 700, bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </DialogActions>
        </form>
    );
}
