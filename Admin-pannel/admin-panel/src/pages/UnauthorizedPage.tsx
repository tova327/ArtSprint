import { Button, Typography, Stack } from "@mui/material";

export default function UnauthorizedPage() {
  return (
    <Stack
      sx={{ height: "100vh" }}
      spacing={2}
    >
      <Typography variant="h5">
        You do not have permission to access the admin panel.
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          window.location.href =
            "https://artsprint.onrender.com"
        }
      >
        Go to ArtSprint
      </Button>
    </Stack>
  );
}