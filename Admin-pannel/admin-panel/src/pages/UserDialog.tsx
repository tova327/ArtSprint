import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

import type {
  UserPostModel,
} from "../types/user.types";

type Props = {
  open: boolean;
  editId: number | null;
  form: UserPostModel;
  setForm: React.Dispatch<
    React.SetStateAction<UserPostModel>
  >;
  onClose: () => void;
  onSave: () => void;
};

export default function UserDialog({
  open,
  editId,
  form,
  setForm,
  onClose,
  onSave,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      
    >
      <DialogTitle>
        {editId
          ? "Edit User"
          : "Create User"}
      </DialogTitle>

      <DialogContent>
  <Box
    component="form"
    autoComplete="off"
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 2,
      mt: 1,
    }}
  >
    <TextField
      label="Name"
      name="user_name_field"
      value={form.name}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          name: e.target.value,
        }))
      }
      autoComplete="new-password"
    />

    <TextField
      label="Email"
      name="user_email_field"
      value={form.email}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          email: e.target.value,
        }))
      }
      autoComplete="new-password"
    />

    <TextField
      label="Password"
      name="user_password_field"
      type="password"
      value={form.password}
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          password: e.target.value,
        }))
      }
      autoComplete="new-password"
    />

    <TextField
      type="date"
      label="Birth Date"
      name="user_birthdate_field"
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
      autoComplete="off"
    />

    <TextField
      select
      label="Role"
      name="user_role_field"
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
  </Box>
</DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}