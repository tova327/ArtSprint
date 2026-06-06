import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../api/usersApi";



import { toast } from "sonner";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { UserDTO, UserPostModel } from "../types/user.types";
import UserDialog from "./UserDialog";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDTO[]>([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<UserPostModel>({
      name: "",
      email: "",
      password: "",
      birthDate: "",
      role: "member",
    });

  // =====================
  // LOAD
  // =====================

  const load = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =====================
  // SAVE
  // =====================

  const handleSave = async () => {
    try {
      if (editId) {
        await updateUser(editId, form);
        toast.success("User updated");
      } else {
        await createUser(form);
        toast.success("User created");
      }

      setOpen(false);

      resetForm();

      load();
    } catch {
      toast.error("Error saving user");
    }
  };

  // =====================
  // DELETE
  // =====================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUser(deleteId);

      toast.success("Deleted");

      setDeleteId(null);

      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  // =====================
  // EDIT
  // =====================

  const handleEdit = (user: UserDTO) => {
    setEditId(user.id);

    setForm({
      name: user.name,
      email: user.email,
      password: "",
      birthDate: new Date(user.birthDate).toISOString().split("T")[0],
      role: user.role ?? "member",
    });

    setOpen(true);
  };

  // =====================
  // RESET
  // =====================

  const resetForm = () => {
    setEditId(null);

    setForm({
      name: "",
      email: "",
      password: "",
      birthDate: "",
      role: "member",
    });
  };

  // =====================
  // FILTER
  // =====================

  const filtered = users.filter((u) => {
    const text =
      `${u.name} ${u.email}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage application users"
        action={
          <Button
            variant="contained"
            onClick={() => {
              (document.activeElement as HTMLElement)?.blur?.();
              resetForm();
              setOpen(true);
            }}
          >
            Add User
          </Button>
        }
      />

      <SearchBox
        key="users-search"
        value={search}
        onChange={setSearch}
        placeholder="Search users"

      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Medal</TableCell>
              <TableCell>Paintings</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>

                <TableCell>{u.name}</TableCell>

                <TableCell>{u.role}</TableCell>
                <TableCell>{u.email}</TableCell>

                <TableCell>
                  {new Date(
                    u.birthDate
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {new Date(
                    u.cameOn
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  {u.isMedal ? "🏅" : "-"}
                </TableCell>

                <TableCell>
                  {u.paintings.length}
                </TableCell>

                <TableCell>
                  {u.comments.length}
                </TableCell>

                <TableCell>
                  <Button
                    onClick={() =>
                      handleEdit(u)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    color="error"
                    onClick={() =>
                      setDeleteId(u.id)
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <EmptyState text="No users found" />
        )}
      </Paper>

      {/* =====================
          FORM DIALOG
      ===================== */}

      <UserDialog
        open={open}
        editId={editId}
        form={form}
        setForm={setForm}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />

      {/* =====================
          DELETE DIALOG
      ===================== */}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete user?"
        description="This action cannot be undone"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}