import { AccessTime, Call, ChevronRight, Facebook, Instagram, LinkedIn, LocationOn, School, Verified, Work } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, Container, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import doctorPortrait from "../../assets/doctor_portrait.png";
import Navber from "./Navber";

export default function HomePage() {
    const services = [
        { title: "Laser Surgery", description: "Advanced laser treatments for various skin conditions including scars and aging.", icon: <Verified /> },
        { title: "Dermato Surgery", description: "Expert surgical procedures for skin diseases and aesthetic improvements.", icon: <Verified /> },
        { title: "Aesthetic Medicine", description: "Non-surgical cosmetic treatments to enhance and rejuvenate skin appearance.", icon: <Verified /> },
        { title: "Skin & VD Consultation", description: "Comprehensive diagnosis and treatment for all skin and venereal diseases.", icon: <Verified /> },
    ];

    const stats = [
        { label: "Years Experience", value: "15+" },
        { label: "Happy Patients", value: "10K+" },
        { label: "Specializations", value: "12+" },
        { label: "Professional Awards", value: "05+" },
    ];

    return (
        <Box sx={{ bgcolor: "white" }}>
            <Navber />

            {/* Hero Section */}
            <Box id="home" sx={{
                position: "relative",
                pt: { xs: 8, md: 12 },
                pb: { xs: 8, md: 15 },
                overflow: "hidden",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            }}>
                {/* Decorative Background Elements */}
                <Box sx={{
                    position: "absolute", top: -150, right: -150, width: 500, height: 500,
                    borderRadius: "50%", background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0) 70%)", zIndex: 0
                }} />

                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Stack direction={{ xs: "column", md: "row" }} spacing={6} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                            <Stack spacing={3}>
                                <Box sx={{ display: "inline-flex", px: 2, py: 1, bgcolor: "rgba(59, 130, 246, 0.1)", borderRadius: "50px", width: "fit-content" }}>
                                    <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 800, letterSpacing: "0.1em" }}>
                                        SKIN & VD SPECIALIST
                                    </Typography>
                                </Box>
                                <Typography variant="h1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.1, fontSize: { xs: "3rem", md: "4.5rem" } }}>
                                    Expert Care for Your <span style={{ color: "#3b82f6" }}>Skin Health</span>
                                </Typography>
                                <Typography variant="h5" sx={{ color: "#64748b", fontWeight: 500, lineHeight: 1.6, maxWidth: 500 }}>
                                    Providing advanced dermatological treatments with a personal touch. Trust Dr. Nahida Islam Nipa for your skin's well-being.
                                </Typography>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        href="#chamber"
                                        endIcon={<ChevronRight />}
                                        sx={{
                                            borderRadius: "16px", py: 2, px: 4, bgcolor: "#3b82f6", fontWeight: 800, fontSize: "1.1rem", textTransform: "none",
                                            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                                            "&:hover": { bgcolor: "#2563eb" }
                                        }}
                                    >
                                        Book Appointment
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        href="#services"
                                        sx={{
                                            borderRadius: "16px", py: 2, px: 4, borderColor: "#cbd5e1", color: "#1e293b", fontWeight: 700, fontSize: "1.1rem", textTransform: "none",
                                            "&:hover": { borderColor: "#94a3b8", bgcolor: "#f1f5f9" }
                                        }}
                                    >
                                        Our Services
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                        <Box sx={{ width: { xs: "100%", md: "50%" }, display: "flex", justifyContent: "center" }}>
                            <Box sx={{ position: "relative" }}>
                                <Box sx={{
                                    position: "absolute", bottom: -20, right: -20, width: "100%", height: "100%",
                                    border: "2px solid #3b82f6", borderRadius: "30px", zIndex: -1
                                }} />
                                <Avatar
                                    src={doctorPortrait}
                                    sx={{
                                        width: { xs: 300, md: 450 }, height: { xs: 300, md: 450 }, borderRadius: "30px",
                                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                                        border: "8px solid white"
                                    }}
                                />
                                <Box sx={{
                                    position: "absolute", top: 40, right: -30, bgcolor: "white", p: 2, borderRadius: "20px",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2
                                }}>
                                    <Verified sx={{ color: "#22c55e", fontSize: 40 }} />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Verified Expert</Typography>
                                        <Typography variant="caption" color="text.secondary">Certified Dermatologist</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" sx={{ mt: -8, position: "relative", zIndex: 2 }}>
                <Card sx={{ borderRadius: "24px", boxShadow: "0 20px 40px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <CardContent sx={{ p: 0 }}>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
                            {stats.map((stat, index) => (
                                <Box key={index} sx={{
                                    p: 4, textAlign: "center",
                                    borderRight: index < 3 ? { md: "1px solid #f1f5f9" } : "none",
                                    borderBottom: { xs: index < 2 ? "1px solid #f1f5f9" : "none", md: "none" }
                                }}>
                                    <Typography variant="h3" sx={{ fontWeight: 800, color: "#3b82f6", mb: 0.5 }}>{stat.value}</Typography>
                                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>{stat.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {/* Services Section */}
            <Box id="services" sx={{ py: 15, bgcolor: "white" }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 8 }}>
                        <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 800, letterSpacing: "0.1em", mb: 1 }}>OUR SERVICES</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>Specialized Treatments</Typography>
                        <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 500, maxWidth: 600, mx: "auto" }}>
                            We offer a range of dermatological and aesthetic services tailored to your specific needs.
                        </Typography>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 3 }}>
                        {services.map((service, index) => (
                            <Card key={index} sx={{
                                height: "100%", borderRadius: "20px", transition: "all 0.3s", cursor: "pointer",
                                "&:hover": { transform: "translateY(-10px)", boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)", borderColor: "#3b82f6" }
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ p: 1.5, bgcolor: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", width: "fit-content", mb: 3 }}>
                                        <Verified sx={{ color: "#3b82f6" }} />
                                    </Box>
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{service.title}</Typography>
                                    <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.7 }}>{service.description}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* About Section */}
            <Box id="about" sx={{ py: 15, bgcolor: "#f8fafc" }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: "column", md: "row" }} spacing={8} sx={{ alignItems: "center" }}>
                        <Box sx={{ width: { xs: "100%", md: "41.6%" } }}>
                            <Box sx={{ position: "relative" }}>
                                <Avatar
                                    src={doctorPortrait}
                                    sx={{ width: "100%", height: "auto", borderRadius: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                />
                                <Box sx={{
                                    position: "absolute", bottom: -30, right: -30, p: 4, bgcolor: "#1e293b", borderRadius: "24px", color: "white", maxWidth: 250,
                                    boxShadow: "0 15px 30px rgba(0,0,0,0.2)"
                                }}>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#3b82f6", mb: 1 }}>Associate Prof.</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>Head of Department, CBMCH Bangladesh</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ width: { xs: "100%", md: "58.3%" } }}>
                            <Stack spacing={4}>
                                <Box>
                                    <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 800, letterSpacing: "0.1em", mb: 1 }}>ABOUT THE DOCTOR</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 800, color: "#0f172a", mb: 2 }}>Dr. Nahida Islam Nipa</Typography>
                                    <Typography variant="h5" sx={{ color: "#3b82f6", fontWeight: 600, mb: 3 }}>Skin & VD Specialist & Dermato Surgeon</Typography>
                                </Box>
                                <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, fontSize: "1.1rem" }}>
                                    With over 15 years of experience in clinical and aesthetic dermatology, Dr. Nahida Islam Nipa is a renowned expert in her field. She currently serves as Associate Professor & Head of Department at Community Based Medical College & Hospital.
                                </Typography>
                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
                                    {[
                                        { icon: <School />, title: "Education", text: "MBBS, DDV, FRCP (Glasgow)" },
                                        { icon: <Work />, title: "Experience", text: "Head of Dept, CBMCH" },
                                        { icon: <Verified />, title: "Special Training", text: "Laser Surgery (China)" },
                                        { icon: <Verified />, title: "Member", text: "American College of Physicians" }
                                    ].map((item, index) => (
                                        <Box key={index} sx={{ display: "flex", gap: 2 }}>
                                            <Box sx={{ p: 1, bgcolor: "white", borderRadius: "10px", height: "fit-content", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                                                {React.cloneElement(item.icon as React.ReactElement<any>, {
                                                    sx: {
                                                        color: "#3b82f6",
                                                        fontSize: "medium",
                                                    },
                                                })}
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{item.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">{item.text}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </Box>

            {/* Chamber Section */}
            <Box id="chamber" sx={{ py: 15, bgcolor: "white" }}>
                <Container maxWidth="lg">
                    <Box sx={{
                        borderRadius: "40px", bgcolor: "#1e293b", overflow: "hidden",
                        boxShadow: "0 30px 60px rgba(15, 23, 42, 0.2)", position: "relative"
                    }}>
                        {/* Decorative Circle */}
                        <Box sx={{
                            position: "absolute", top: -100, right: -100, width: 400, height: 400,
                            borderRadius: "50%", background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)"
                        }} />

                        <Stack direction={{ xs: "column", md: "row" }}>
                            <Box sx={{ width: { xs: "100%", md: "58.3%" }, p: { xs: 4, md: 8 }, color: "white" }}>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 800, mb: 1 }}>VISIT US</Typography>
                                        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>Delta Health Care</Typography>
                                        <Typography variant="h4" sx={{ color: "#94a3b8", fontWeight: 500 }}>Mymensingh Limited</Typography>
                                    </Box>

                                    <Stack spacing={3}>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <LocationOn sx={{ color: "#ef4444" }} />
                                            <Typography variant="h6" sx={{ fontWeight: 500, opacity: 0.9 }}>
                                                Opposite to Mymensingh Medical College Gate (3rd Floor), Charpara, Mymensingh.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <AccessTime sx={{ color: "#3b82f6" }} />
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 800 }}>Visiting Hours</Typography>
                                                <Typography variant="body1" sx={{ opacity: 0.8 }}>4:00 PM - 8:00 PM</Typography>
                                                <Typography variant="body2" sx={{ color: "#ef4444", fontWeight: 700, mt: 1 }}>Closed on Friday</Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Box>
                            <Box sx={{ width: { xs: "100%", md: "41.6%" }, bgcolor: "rgba(255,255,255,0.03)", p: { xs: 4, md: 8 }, display: "flex", alignItems: "center" }}>
                                <Box sx={{ width: "100%", textAlign: "center", p: 4, bgcolor: "rgba(255,255,255,0.05)", borderRadius: "30px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <Typography variant="h6" sx={{ color: "#3b82f6", fontWeight: 800, mb: 2 }}>BOOK SERIAL</Typography>
                                    <Typography variant="h2" sx={{ fontWeight: 800, color: "white", mb: 4 }}>01777 01 61 79</Typography>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        startIcon={<Call />}
                                        onClick={() => window.location.href = "tel:01777016179"}
                                        sx={{
                                            borderRadius: "16px", py: 2.5, bgcolor: "#3b82f6", fontWeight: 800, fontSize: "1.3rem", textTransform: "none",
                                            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
                                            "&:hover": { bgcolor: "#2563eb" }
                                        }}
                                    >
                                        Call Now to Book
                                    </Button>
                                    <Typography variant="body2" sx={{ mt: 3, opacity: 0.6, fontStyle: "italic" }}>
                                        Immediate confirmation for your appointment.
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ py: 10, bgcolor: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 6 }}>
                        <Box>
                            <Stack spacing={3}>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                                    Appoint<span style={{ color: "#3b82f6" }}>Ment</span>
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.8 }}>
                                    Professional dermatological care at Delta Health Care. Trusted by thousands for skin and aesthetic treatments.
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    {[Facebook, Instagram, LinkedIn].map((Icon, idx) => (
                                        <Box key={idx} sx={{
                                            p: 1.5, bgcolor: "white", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", cursor: "pointer",
                                            transition: "all 0.2s", "&:hover": { color: "#3b82f6", transform: "translateY(-3px)" }
                                        }}>
                                            <Icon />
                                        </Box>
                                    ))}
                                </Stack>
                            </Stack>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Quick Links</Typography>
                            <Stack spacing={1.5}>
                                {["Home", "Services", "About", "Chamber"].map((link) => (
                                    <Typography key={link} variant="body2" component="a" href={`#${link.toLowerCase()}`} sx={{ color: "#64748b", textDecoration: "none", "&:hover": { color: "#3b82f6" } }}>
                                        {link}
                                    </Typography>
                                ))}
                            </Stack>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Services</Typography>
                            <Stack spacing={1.5}>
                                {["Laser Surgery", "Aesthetic Medicine", "Skin & VD", "Dermato Surgery"].map((link) => (
                                    <Typography key={link} variant="body2" sx={{ color: "#64748b" }}>{link}</Typography>
                                ))}
                            </Stack>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Contact Info</Typography>
                            <Stack spacing={2}>
                                <Box sx={{ display: "flex", gap: 1.5 }}>
                                    <LocationOn sx={{ color: "#3b82f6", fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary">Charpara, Mymensingh</Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1.5 }}>
                                    <Call sx={{ color: "#3b82f6", fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary">01777 01 61 79</Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1.5 }}>
                                    <Verified sx={{ color: "#3b82f6", fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary">Verified Medical Practice</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                    <Divider sx={{ my: 6 }} />
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            © 2026 Dr. Nahida Islam Nipa. All rights reserved.
                        </Typography>
                        <Stack direction="row" spacing={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "#3b82f6" } }}>Privacy Policy</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ cursor: "pointer", "&:hover": { color: "#3b82f6" } }}>Terms of Service</Typography>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}
