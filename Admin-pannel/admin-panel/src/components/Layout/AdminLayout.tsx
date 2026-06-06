import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import UserAvatar from "../auth/UserAvatar";

export default function AdminLayout() {
 
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            ArtSprint Admin Panel
          </Typography>

          <UserAvatar />
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <Box sx={{ flex: 1, p: 2 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}