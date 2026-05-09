import { Avatar, Box, Typography } from "@mui/material";
import { Link } from "react-router";
import { useAppDispatch } from "../retux/hooks";
import { logOut } from "../retux/features/authSlice";
import { ArrowBack, LockOutlined, AccountCircle } from "@mui/icons-material";





export default function ProfileSidebar() {
    const dispatch = useAppDispatch();

    const navItems = [
        {
            title: "Profile",
            icon: <AccountCircle />,
            path: "/profile",
        },
        {
            title: "Change Password",
            icon: <LockOutlined />,
            path: "/profile/change-password",
        },
        {
            title: "Dashboard",
            icon: <ArrowBack />,
            path: "/dashboard",

        }

    ]

    return (
        <Box component="section" sx={{ py: 2 }}>
            {/* Brand/Logo Area can go here */}

            {/* User Profile Card */}
            <Box sx={{ px: 3, mb: 4, textAlign: "center" }}>
                <Avatar
                    sx={{ width: 60, height: 60, margin: "0 auto 12px", bgcolor: "#60a5fa" }}
                    alt="User Name"
                >
                    U
                </Avatar>
                <Typography variant="subtitle1" sx={{ color: "white", fontWeight: 600 }}>
                    User Name
                </Typography>
                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    useremail@example.com
                </Typography>
            </Box>

            <Box sx={{ mb: 2 }} className="flex flex-col justify-between align-baseline w-full h-[calc(100vh-290px)]">
                <Box className="h-full">
                    <Typography
                        variant="caption"
                        sx={{
                            px: 3,
                            mb: 1,
                            display: "block",
                            color: "#94a3b8",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                        }}
                    >
                        Main Menu
                    </Typography>
                    {navItems.map((item, idx) => (
                        <Box key={idx}>
                            <Link
                                to={item.path}
                                className="border-b border-slate-800 py-3"
                                style={{
                                    margin: "0.25rem 1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    color: "#fff",
                                    fontWeight: 600,
                                    letterSpacing: "0.05em",
                                    fontSize: "0.9rem",
                                    borderRadius: "10px",
                                }}
                            >
                                {item.icon} {item.title}
                            </Link>

                        </Box>
                    ))}

                </Box>
                <Box className="bg-slate-800 rounded-lg">
                    <Link
                        to="/login"
                        className="border-t border-slate-800 py-2"
                        style={{
                            margin: "0.25rem 1rem",
                            display: "block",
                            color: "#fff",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                        onClick={() => {
                            dispatch(logOut());
                        }}
                    >
                        Logout
                    </Link>

                </Box>
            </Box>
        </Box >
    )
}
