import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
 
  IconButton,
  MenuItem,
  
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useEffect, useMemo, useState } from "react";

import {
  createPainting,
  deletePainting,
  getPaintings,
  updatePainting,
} from "../api/paintingsApi";

import { getUsers } from "../api/usersApi";
import { getCategories } from "../api/categoriesApi";



import { toast } from "sonner";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { CategoryDTO } from "../types/category.types";
import type { PaintingDTO, PaintingPostModel } from "../types/painting.types";
import type { UserDTO } from "../types/user.types";

export default function PaintingsPage() {
  const [paintings, setPaintings] = useState<
    PaintingDTO[]
  >([]);

  const [users, setUsers] = useState<UserDTO[]>(
    []
  );

  const [categories, setCategories] = useState<
    CategoryDTO[]
  >([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [preview, setPreview] =
    useState<PaintingDTO | null>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [editPainting, setEditPainting] =
    useState<PaintingDTO | null>(null);

  const [open, setOpen] = useState(false);

  const [form, setForm] =
    useState<PaintingPostModel>({
      ownerId: 0,
      name: "",
      categoryId: 0,
      paintingFile: null,
    });

  // =====================
  // LOAD
  // =====================

  const load = async () => {
    try {
      setLoading(true);

      const [
        paintingsRes,
        usersRes,
        categoriesRes,
      ] = await Promise.all([
        getPaintings(),
        getUsers(),
        getCategories(),
      ]);

      setPaintings(paintingsRes.data);

      setUsers(usersRes.data);

      setCategories(categoriesRes.data);
    } catch {
      toast.error("Failed loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =====================
  // HELPERS
  // =====================

  const getUserName = (id: number) => {
    return (
      users.find((u) => u.id === id)?.name ||
      "Unknown"
    );
  };

  const getCategoryName = (id: number) => {
    return (
      categories.find((c) => c.id === id)
        ?.name || "Unknown"
    );
  };

  // =====================
  // CREATE
  // =====================

  const handleCreate = async () => {
    if(form.ownerId === 0 || form.categoryId === 0 || !form.name || form.name.trim()=== "" || !form.paintingFile) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await createPainting(form);

      toast.success("Painting created");

      setOpen(false);

      resetForm();

      load();
    } catch {
      toast.error("Create failed");
    }
  };

  // =====================
  // UPDATE
  // =====================

  const handleUpdate = async () => {
    if (!editPainting) return;
    const paintingPostModel={ownerId: editPainting.ownerId, name: editPainting.name, categoryId: editPainting.categoryId, paintingFile: null} as PaintingPostModel
    try {
      await updatePainting(
        paintingPostModel,
        editPainting.id
      );

      toast.success("Updated");

      setEditPainting(null);

      load();
    } catch {
      toast.error("Update failed");
    }
  };

  // =====================
  // DELETE
  // =====================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deletePainting(deleteId);

      toast.success("Deleted");

      setDeleteId(null);

      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  // =====================
  // RESET
  // =====================

  const resetForm = () => {
    setForm({
      ownerId: 0,
      name: "",
      categoryId: 0,
      paintingFile: null,
    });
  };

  // =====================
  // FILTER
  // =====================

  const filtered = useMemo(() => {
    return paintings.filter((p) =>
      p.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [paintings, search]);

  if (loading) {
    return (
      <Typography>
        Loading paintings...
      </Typography>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Paintings"
        subtitle="Manage all paintings"
        action={
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Add Painting
          </Button>
        }
      />

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search paintings"
      />

      {filtered.length === 0 ? (
        <EmptyState text="No paintings found" />
      ) : (
        <Grid container spacing={2}>
          {filtered.map((p) => (
           <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardMedia
                  component="img"
                  height="220"
                  image={
                    p.url ||
                    "https://placehold.co/600x400"
                  }
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    
                  >
                    {p.name}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Artist:
                    {" "}
                    {getUserName(p.ownerId)}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Category:
                    {" "}
                    {getCategoryName(
                      p.categoryId
                    )}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    Likes: {p.likes}
                  </Typography>

                  <Typography
                    color="text.secondary"
                  >
                    {new Date(
                      p.createdAt
                    ).toLocaleDateString()}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        setPreview(p)
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      onClick={() =>
                        setEditPainting(p)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        setDeleteId(p.id)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* =====================
          CREATE DIALOG
      ===================== */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogTitle>
          Add Painting
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <TextField
              select
              required
              label="Owner"
              value={form.ownerId}
              onChange={(e) =>
                setForm({
                  ...form,
                  ownerId: Number(
                    e.target.value
                  ),
                })
              }
            >
              {users.map((u) => (
                <MenuItem
                  key={u.id}
                  value={u.id}
                >
                  {u.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              required
              label="Painting Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <TextField
              select
              required
              label="Category"
              value={form.categoryId}
              onChange={(e) =>
                setForm({
                  ...form,
                  categoryId: Number(
                    e.target.value
                  ),
                })
              }
            >
              {categories.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="outlined"
              component="label"
            >
              Upload File

              <input
                hidden
                required
                type="file"
                onChange={(e) =>
                  setForm({
                    ...form,
                    paintingFile:
                      e.target.files?.[0] ||
                      null,
                  })
                }
              />
            </Button>

            {form.paintingFile && (
              <Typography>
                {form.paintingFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================
          PREVIEW
      ===================== */}

      <Dialog
        open={!!preview}
        onClose={() => setPreview(null)}
        maxWidth="md"
      >
        {preview && (
          <>
            <DialogTitle>
              {preview.name}
            </DialogTitle>

            <DialogContent>
              <img
                src={
                  preview.url ||
                  "https://placehold.co/600x400"
                }
                width="100%"
              />
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* =====================
          EDIT
      ===================== */}

      <Dialog
        open={!!editPainting}
        onClose={() =>
          setEditPainting(null)
        }
        fullWidth
      >
        <DialogTitle>
          Edit Painting
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
          <TextField
            fullWidth
            label="Painting Name"
            value={editPainting?.name || ""}
            onChange={(e) =>
              setEditPainting((prev) =>
                prev
                  ? {
                      ...prev,
                      name:
                        e.target.value,
                    }
                  : null
              )
            }
            sx={{ mt: 2 }}
          />
          <TextField
              select
              required
              fullWidth
              label="Category"
              value={editPainting?.categoryId}
              onChange={(e) =>
                setEditPainting((prev) =>
                prev
                  ? {
                      ...prev,
                      categoryId: Number(
                        e.target.value),
                    }
                  : null
              )
              }
            >
              {categories.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </MenuItem>
              ))}
            </TextField></Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setEditPainting(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================
          DELETE
      ===================== */}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete painting?"
        description="This action cannot be undone"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}