import { Home, KeyboardArrowDown } from "@mui/icons-material";
import { Box, Collapse, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { selectCurrentToken } from "../retux/features/authSlice";
import { useAppSelector } from "../retux/hooks";
import { decodeToken } from "../utils/decodeToken";
import { dashboardRoutes, type RouteConfig } from "./routerConfig";

interface SidebarItemProps {
  item: RouteConfig;
  depth?: number;
  hasAccess: (item: RouteConfig) => boolean;
}

const SidebarItem = ({ item, depth = 0, hasAccess }: SidebarItemProps) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Calculate if active
  const itemPath = item.index ? "/dashboard" : `/dashboard/${item.path}`;
  const isActive = location.pathname === itemPath;
  const hasChildren = item.children && item.children.filter(c => c.title && !c.hidden && hasAccess(c)).length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    }
  };

  const content = (
    <Box
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1.2,
        px: 2,
        mb: 0.5,
        mx: 1,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        color: isActive ? "#60a5fa" : "#94a3b8",
        bgcolor: isActive ? "rgba(30, 41, 59, 0.5)" : "transparent",
        position: "relative",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.05)",
          color: "#f1f5f9",
        },
        ...(isActive && {
          "&::before": {
            content: '""',
            position: "absolute",
            left: -8,
            top: "20%",
            bottom: "20%",
            width: "4px",
            backgroundColor: "#3b82f6",
            borderRadius: "0 4px 4px 0",
          }
        })
      }}
    >
      {item.icon && (
        <Box sx={{
          mr: 1.5,
          display: "flex",
          alignItems: "center",
          color: isActive ? "#3b82f6" : "inherit",
          "& svg": { fontSize: "20px" }
        }}>
          {item.icon}
        </Box>
      )}
      <Typography
        variant="body2"
        sx={{
          fontWeight: isActive ? 600 : 500,
          flexGrow: 1,
          fontSize: "0.875rem",
          letterSpacing: "0.01em",
        }}
      >
        {item.title}
      </Typography>
      {hasChildren && (
        <KeyboardArrowDown
          sx={{
            fontSize: "18px",
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            opacity: 0.7
          }}
        />
      )}
    </Box>
  );

  if (hasChildren) {
    return (
      <Box sx={{ mb: 0.5 }}>
        {content}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{
            mt: 0.5,
            ml: 3,
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            pl: 1
          }}>
            {item.children?.filter(c => c.title && !c.hidden && hasAccess(c)).map((child, idx) => (
              <SidebarItem key={idx} item={child} depth={depth + 1} hasAccess={hasAccess} />
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  }

  return (
    <Link to={itemPath} style={{ textDecoration: "none" }}>
      {content}
    </Link>
  );
};

export default function SideBar() {
  const token = useAppSelector(selectCurrentToken);
  // const location = useLocation();

  let user: { role?: string[] } = {};

  if (token) {
    const decoded = decodeToken(token as string) as unknown as {
      role?: string | string[];
    };
    user = {
      role: Array.isArray(decoded.role)
        ? decoded.role
        : decoded.role
          ? [decoded.role]
          : [],
    };
  }

  const hasAccess = (item: RouteConfig) => {
    if (!item.roles) return true;
    return item.roles.some((role: string) => (user.role ?? []).includes(role));
  };

  const homeItem: RouteConfig = {
    title: "Dashboard Home",
    icon: <Home />,
    path: "",
    index: true,
  };

  return (
    <Box component="section" sx={{ py: 2 }}>
      {/* Brand/Logo Area can go here */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>
          Appoint<span style={{ color: "#3b82f6" }}>Ment</span>
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 3,
            mb: 1,
            display: "block",
            color: "#64748b",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}
        >
          Main Menu
        </Typography>

        <SidebarItem item={homeItem} hasAccess={hasAccess} />

        {dashboardRoutes
          .filter((item) => item.title && !item.hidden && hasAccess(item))
          .map((item, idx) => (
            <SidebarItem key={idx} item={item} hasAccess={hasAccess} />
          ))}
      </Box>
    </Box>
  );
}

