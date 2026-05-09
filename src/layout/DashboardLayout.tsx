import { Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import SideBar from "./SideBar";

export default function Dashboardlayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[60px] bg-slate-950 flex items-center justify-between px-4 border-b border-slate-800">
        {/* Left: Toggler (visible only on small screens) */}
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{ display: { md: "none", xs: "block" }, color: "white" }}
        >
          <Menu />
        </IconButton>
        <Header />
      </div>

      {/* Content with sidebar */}
      <div className="flex h-[calc(100vh-60px)] relative bg-slate-50">
        {/* Sidebar */}
        <div
          className={`
            fixed top-[60px] left-0 h-[calc(100vh-60px)] z-50
            w-[280px] bg-slate-950 p-2 overflow-y-auto border-r border-slate-800
            transform transition-transform duration-300 ease-in-out
            ${open ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0 md:w-[300px]
          `}
        >
          <SideBar />
        </div>

        {/* Main content */}
        <div className="w-full h-full p-2 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
