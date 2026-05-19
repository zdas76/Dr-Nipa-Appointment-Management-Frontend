import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Divider,
    Button,
    Stack,
    Switch,
    TextField,
} from "@mui/material";
import {
    Call,
    LocationOn,
    AccessTime,
    School,
    Work,
    Verified,
    LocalDining,
} from "@mui/icons-material";
import doctorPortrait from "../../assets/doctor_portrait.png";
import BasicModal from "../../component/Modal/BasicModel";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useAddSafeMutation, useGetDoctorQuery } from "../../redux/api/doctorAPI";


export default function Profile() {

    const { user } = useSelector((state: RootState) => state.auth);

    const [addSafe, { isLoading: addSafeLoading }] = useAddSafeMutation();

    const { data: DoctorData, isLoading } = useGetDoctorQuery(user?.email, {
        skip: !user?.email,
        refetchOnMountOrArgChange: true,
    });

    const doctorData = {
        name: DoctorData?.data?.nameBangla || "",
        englishName: DoctorData?.data?.nameEnglish || "",
        title: DoctorData?.data?.designation || "",
        specialization: DoctorData?.data?.designation || "",
        englishSpecialization: DoctorData?.data?.designation || "",
        qualifications: [
            "MBBS (DU)",
            "DDV (DU)",
            "FRCP (Glasgow)",
            "Laser Special Training (China)",
            "Member of ACP (American College of Physicians)",
        ],
        institution: "Community Based Medical College & Hospital, Bangladesh",
        chamber: {
            name: "Delta Health Care",
            location: "Mymensingh Limited",
            address: "Opposite to Mymensingh Medical College Gate (3rd Floor), Charpara, Mymensingh.",
            time: "4:00 PM - 8:00 PM",
            offDay: "Friday",
            serial: "01777 01 61 79",
        },
        image: doctorPortrait
    };

    const services = [
        { title: "Laser Surgery", description: "Advanced laser treatments for various skin conditions.", icon: <Verified /> },
        { title: "Dermato Surgery", description: "Surgical procedures for skin diseases and aesthetic improvements.", icon: <Verified /> },
        { title: "Aesthetic Medicine", description: "Non-surgical cosmetic treatments to enhance skin appearance.", icon: <Verified /> },
        { title: "Skin & VD Consultation", description: "Comprehensive diagnosis and treatment for all skin and venereal diseases.", icon: <Verified /> },
    ];

    if (isLoading) {
        return <LocalDining />
    }

    const handelCheck = (checked: boolean) => {
        console.log("checked", checked)
        addSafe({ id: DoctorData?.data?.isSafes[0]?.id, payload: { isSafe: checked, doctorId: DoctorData?.data?.id } })

    }

    const handelLimit = (limit: number) => {
        console.log("limit", limit)
        addSafe({ id: DoctorData?.data?.isSafes[0]?.id, payload: { limit, doctorId: DoctorData?.data?.id } })
    }

    return (
        <Box sx={{
            maxWidth: 1200,
            mx: "auto",
            p: { xs: 2, md: 4 },
            position: "relative",
            "&::before": {
                content: '""',
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 70%)",
                zIndex: -1,
            }
        }}>
            {/* Hero Section */}
            <Card sx={{
                mb: 4,
                overflow: "hidden",
                borderRadius: 6,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
                border: "1px solid rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)"
            }}>
                <Stack direction={{ xs: "column", md: "row" }}>
                    <Box sx={{ width: { xs: "100%", md: "33.3%" }, p: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Box sx={{ position: "relative" }}>
                            <Avatar
                                src={doctorData.image}
                                sx={{
                                    width: 280,
                                    height: 280,
                                    boxShadow: "0 12px 32px rgba(59, 130, 246, 0.2)",
                                    border: "6px solid white"
                                }}
                            />
                            <Box sx={{
                                position: "absolute",
                                bottom: 10,
                                right: 10,
                                bgcolor: "#22c55e",
                                p: 1,
                                borderRadius: "50%",
                                border: "4px solid white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Verified sx={{ color: "white", fontSize: 24 }} />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: { xs: "100%", md: "66.6%" }, p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h2" sx={{ fontWeight: 800, color: "#0f172a", fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 1 }}>
                                    {doctorData.name}
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 500, color: "#64748b", mb: 2 }}>
                                    {doctorData.englishName}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                <Typography variant="h5" sx={{ color: "#3b82f6", fontWeight: 700, letterSpacing: "-0.01em" }}>
                                    {doctorData.title}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#94a3b8", fontWeight: 600, fontSize: "1.1rem" }}>
                                    {doctorData.institution}
                                </Typography>
                            </Box>
                            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                                <Chip
                                    label={doctorData.specialization}
                                    sx={{
                                        bgcolor: "rgba(59, 130, 246, 0.1)",
                                        color: "#3b82f6",
                                        fontWeight: 700,
                                        px: 2,
                                        py: 3,
                                        fontSize: "1.1rem",
                                        border: "1px solid rgba(59, 130, 246, 0.2)",
                                        borderRadius: "16px"
                                    }}
                                />
                                <BasicModal buttonLabel="Edit Profile">
                                    <EditProfile email={user.email} />
                                </BasicModal>
                            </Box>
                        </Stack>
                    </Box>
                </Stack>
            </Card>

            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
                {/* Left Column: Qualifications & Services */}
                <Box sx={{ width: { xs: "100%", md: "58.3%" } }}>
                    <Stack spacing={4}>
                        {/* Qualifications Card */}
                        <Card sx={{ borderRadius: 6, boxShadow: "0 10px 25px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9" }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: "rgba(59, 130, 246, 0.1)", borderRadius: 3 }}>
                                        <School sx={{ color: "#3b82f6", fontSize: 28 }} />
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>Expertise & Education</Typography>
                                </Box>
                                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                                <Typography variant="h6" sx={{ mb: 3, color: "#334155", fontWeight: 700 }}>
                                    {doctorData.englishSpecialization}
                                </Typography>

                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
                                    {doctorData.qualifications.map((q, index) => (
                                        <Box key={index} sx={{
                                            px: 2,
                                            py: 1.5,
                                            bgcolor: "#f8fafc",
                                            borderRadius: 3,
                                            border: "1px solid #e2e8f0",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            transition: "all 0.2s",
                                            "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderColor: "#3b82f6" }
                                        }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#3b82f6" }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>{q}</Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ p: 4, bgcolor: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1.5 }}>
                                        <Work sx={{ color: "#64748b", fontSize: 24 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#334155" }}>
                                            Professional Background
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8 }}>
                                        Specialized training in <strong>Laser Surgery</strong> from China and Fellow of the <strong>Royal College of Physicians (Glasgow)</strong>. Active Member of the <strong>American College of Physicians</strong>, dedicated to advancing dermatological science.
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Services Section */}
                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 4, mb: 2, px: 2 }}>Services Offered</Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                            {services.map((service, index) => (
                                <Card key={index} sx={{
                                    height: "100%",
                                    borderRadius: 5,
                                    transition: "all 0.3s",
                                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 30px rgba(59, 130, 246, 0.1)" }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ color: "#3b82f6", mb: 1.5 }}>{service.icon}</Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>{service.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{service.description}</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mt: 4, mb: 2, px: 2 }}>Safe Appointment</Typography>
                            <Box>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "left",
                                    justifyContent: "space-between",
                                    px: 2,
                                    py: 2,
                                    bgcolor: "white",
                                    borderRadius: 3,
                                    border: "1px solid #f1f5f9",
                                    boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                                }}>
                                    <Box sx={{ display: "flex", alignItems: "left", gap: 2, justifyContent: "space-between" }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2, px: 2 }}>Is Safe</Typography>
                                        <Switch defaultChecked={DoctorData?.data?.isSafes[0].isSafe} onChange={(e) => handelCheck(e.target.checked)} disabled={addSafeLoading} />
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "left", gap: 2, justifyContent: "space-between" }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 2, px: 2 }}>Data Limit</Typography>
                                        <TextField
                                            disabled={addSafeLoading}
                                            defaultValue={DoctorData?.data?.isSafes[0].limit}
                                            onBlur={(e) => handelLimit(Number(e.target.value))}
                                            type="number"
                                            size="small"
                                            sx={{ width: "80px" }}
                                        />
                                    </Box>

                                </Box>

                            </Box>
                        </Box>
                    </Stack>
                </Box>

                {/* Right Column: Chamber & Schedule */}
                <Box sx={{ width: { xs: "100%", md: "41.6%" } }}>
                    <Stack spacing={4}>
                        <Card sx={{ borderRadius: 6, boxShadow: "0 10px 25px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
                            <Box sx={{ height: 8, bgcolor: "#3b82f6" }} />
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: "rgba(239, 68, 68, 0.1)", borderRadius: 3 }}>
                                        <LocationOn sx={{ color: "#ef4444", fontSize: 28 }} />
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>Location</Typography>
                                </Box>
                                <Divider sx={{ mb: 4, opacity: 0.6 }} />

                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="h5" sx={{ color: "#1e293b", fontWeight: 800, mb: 1 }}>
                                            {doctorData.chamber.name}
                                        </Typography>
                                        <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 600, mb: 2 }}>
                                            {doctorData.chamber.location}
                                        </Typography>
                                        <Box sx={{ display: "flex", gap: 1.5 }}>
                                            <LocationOn sx={{ color: "#94a3b8", fontSize: 20, mt: 0.5 }} />
                                            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.6 }}>
                                                {doctorData.chamber.address}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 4, border: "1px solid #e2e8f0" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                            <AccessTime sx={{ color: "#3b82f6" }} />
                                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Visiting Schedule</Typography>
                                        </Box>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#475569" }}>Time:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 800, color: "#1e293b" }}>{doctorData.chamber.time}</Typography>
                                            </Box>
                                            <Divider />
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#475569" }}>Availability:</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 800, color: "#ef4444" }}>Closed on {doctorData.chamber.offDay}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>

                                    <Box sx={{
                                        p: 4,
                                        bgcolor: "#1e293b",
                                        borderRadius: 5,
                                        textAlign: "center",
                                        color: "white",
                                        boxShadow: "0 15px 35px rgba(15, 23, 42, 0.2)"
                                    }}>
                                        <Typography variant="subtitle2" sx={{ color: "#94a3b8", fontWeight: 700, mb: 1, letterSpacing: "0.1em" }}>
                                            BOOK AN APPOINTMENT
                                        </Typography>
                                        <Typography variant="h3" sx={{ color: "#60a5fa", fontWeight: 800, mb: 3 }}>
                                            {doctorData.chamber.serial}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<Call />}
                                            sx={{
                                                borderRadius: 3,
                                                py: 2,
                                                fontWeight: 800,
                                                textTransform: "none",
                                                fontSize: "1.2rem",
                                                bgcolor: "#3b82f6",
                                                "&:hover": { bgcolor: "#2563eb" }
                                            }}
                                            onClick={() => window.location.href = `tel:${doctorData.chamber.serial.replace(/\s/g, '')}`}
                                        >
                                            Call for Serial
                                        </Button>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
