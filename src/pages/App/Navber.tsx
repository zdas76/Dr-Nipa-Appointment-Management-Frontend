import { AppBar, Box, Button, Container, Toolbar, Typography, useScrollTrigger } from "@mui/material";

import { Link } from "react-router";

export default function Navber() {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return (
        <AppBar
            position="sticky"
            sx={{
                bgcolor: trigger ? "rgba(255, 255, 255, 0.8)" : "transparent",
                backdropFilter: trigger ? "blur(10px)" : "none",
                boxShadow: trigger ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.3s ease-in-out",
                borderBottom: trigger ? "1px solid rgba(0,0,0,0.05)" : "none",
            }}
        >
            <Container maxWidth="lg">
                <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 800,
                            color: "#1e293b",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                        component={Link}
                        to="/"
                    >
                        Dr. Nipa's<span style={{ color: "#3b82f6" }}>Chamber</span>
                    </Typography>

                    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
                        {["Home", "Services", "About", "Chamber"].map((item) => (
                            <Typography
                                key={item}
                                component="a"
                                href={`#${item.toLowerCase()}`}
                                sx={{
                                    color: "#64748b",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    transition: "color 0.2s",
                                    "&:hover": { color: "#3b82f6" },
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            component={Link}
                            to="/login"
                            variant="outlined"
                            sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 700,
                                borderColor: "#e2e8f0",
                                color: "#1e293b",
                                "&:hover": { bgcolor: "#f8fafc", borderColor: "#cbd5e1" },
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            href="#chamber"
                            variant="contained"
                            sx={{
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 700,
                                bgcolor: "#3b82f6",
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                                "&:hover": { bgcolor: "#2563eb" },
                            }}
                        >
                            Book Now
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
