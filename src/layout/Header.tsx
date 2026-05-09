import { Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <div className=" w-full">
      <Toolbar className="flex flex-row justify-between">
        <Typography className=" px-3 py-1 bg-white rounded-2xl">
          <Link to="/dashboard" className="flex justify-center items-center">
            {/* <img src={Logo} width={40} alt="Logo" /> */}
            <span className="text-md md:text-xl font-bold ml-3 uppercase text-blue-800">
              Dr. Nahida Islam Nipa
            </span>
          </Link>
        </Typography>
        <Box>
          <UserMenu />
        </Box>
      </Toolbar>
    </div>
  );
}
