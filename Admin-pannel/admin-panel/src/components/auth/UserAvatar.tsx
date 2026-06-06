import { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  Chip,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Edit,
  Logout,
  Person,
  Login,
  WorkspacePremium,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider";

export const UserAvatar = () => {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // -----------------------------------
  // USER INITIALS
  // -----------------------------------
  const initials = useMemo(() => {
    if (!user?.name) return "?";

    return user.name
      .split(" ")
      .map((x) => x[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  // -----------------------------------
  // NOT AUTHENTICATED
  // -----------------------------------
  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="contained"
        startIcon={<Login />}
        onClick={() => navigate("/login")}
      >
        Login
      </Button>
    );
  }

  // -----------------------------------
  // COMPONENT
  // -----------------------------------
  return (
    <>
      <Avatar
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          width: 40,
          height: 40,
          cursor: "pointer",
          userSelect: "none",
          fontWeight: 700,
          bgcolor: user.role === "admin" ? "#faad14" : "#1976d2",
        }}
      >
        {initials}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            minWidth: 240,
          }}
        >
          <Box   >
            <Avatar sx={{ width: 48, height: 48 }}>
              {initials}
            </Avatar>

            <Box>
              <Typography >
                {user.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {user.email}
              </Typography>

              {user.role === "admin" && (
                <Chip
                  size="small"
                  icon={<WorkspacePremium />}
                  label="Admin"
                  color="warning"
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        <MenuItem
          onClick={() => {
            navigate("/profile");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          View Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/profile/edit");
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Edit Profile
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            logout();
            setAnchorEl(null);
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Logout color="error" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserAvatar;