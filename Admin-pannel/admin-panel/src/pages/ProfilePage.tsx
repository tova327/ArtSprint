import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Not authenticated</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 850, mx: "auto", mt: 4, px: 2 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ alignItems: { xs: "center", sm: "flex-start" } }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: 40,
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                
                spacing={2}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {user.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Chip
                    label={user.role.toUpperCase()}
                    color={user.role === "admin" ? "error" : "primary"}
                  />

                  {user.isMedal && (
                    <Chip
                      label="Medal Winner"
                      color="success"
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Member Since
              </Typography>
              <Typography>
                {new Date(user.cameOn).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Birth Date
              </Typography>
              <Typography>
                {new Date(user.birthDate).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Paintings
              </Typography>
              <Typography>
                {user.paintings?.length ?? 0}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Comments
              </Typography>
              <Typography>
                {user.comments?.length ?? 0}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="caption" color="text.secondary">
                Last Painting
              </Typography>
              <Typography>
                {user.lastPaint
                  ? new Date(user.lastPaint).toLocaleDateString()
                  : "No paintings yet"}
              </Typography>
            </Grid>

          </Grid>

          <Divider sx={{ my: 4 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("edit")}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={logout}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}