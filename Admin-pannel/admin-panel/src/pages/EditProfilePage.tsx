import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../components/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import type { UserPostModel } from "../types/user.types";
import { updateUser } from "../api/usersApi";
import { toast } from "sonner";

export default function EditProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<UserPostModel>({
    name: "",
    email: "",
    password: "",
    birthDate: "",
    role: "member",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        birthDate: user.birthDate ?? "",
        role: user.role ?? "member",
      });
    }
  }, [user]);

  const resetForm = () => {
    setForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      birthDate: user?.birthDate ?? "",
      role: user?.role ?? "member",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateUser(user?.id ?? -1, form);

      toast.success("User updated");

      await refreshUser();
      resetForm();
    } catch {
      toast.error("Error saving user");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Profile
          </Typography>

          <Stack spacing={2} sx={{ mt: 3 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />

            <TextField
              type="date"
              label="Birth Date"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              value={
                form.birthDate
                  ? new Date(form.birthDate)
                    .toISOString()
                    .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  birthDate: e.target.value,
                }))
              }
            />

            <TextField
              select
              label="Role"
              value={form.role}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  role: e.target.value as
                    | "member"
                    | "admin",
                }))
              }
            >
              <MenuItem value="member">
                Member
              </MenuItem>

              <MenuItem value="admin">
                Admin
              </MenuItem>
            </TextField>

            <Stack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                Save
              </Button>
            </Stack>

            {saving && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 4 }}
      >
        Updating your profile might require re-identification.
      </Typography>
    </Box>
  );
}