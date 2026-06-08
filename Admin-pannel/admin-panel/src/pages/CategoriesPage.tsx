import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";


import {
  TreeItem,
  SimpleTreeView
} from "@mui/x-tree-view";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { CategoryDTO, CategoryPostModel } from "../types/category.types";
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from "../hooks/useCategories";

export default function CategoriesPage() {
  const {
  data: categories = [],
  isLoading: loading,
  error,
} = useCategories();

const createCategoryMutation =
  useCreateCategory();

const updateCategoryMutation =
  useUpdateCategory();

const deleteCategoryMutation =
  useDeleteCategory();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [editId, setEditId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<CategoryPostModel>({
      name: "",
      description: "",
      parentCategoryId: null,
      isActive: true,
    });
    
useEffect(() => {
  if (error) {
    toast.error("Failed loading categories");
  }
}, [error]);
  
  // =====================
  // SAVE
  // =====================

  const handleSave = async () => {
  try {
    if (editId) {
      await updateCategoryMutation.mutateAsync({
        id: editId,
        data: form,
      });

      toast.success("Category updated");
    } else {
      await createCategoryMutation.mutateAsync(
        form
      );

      toast.success("Category created");
    }

    setOpen(false);
    resetForm();
  } catch {
    toast.error("Save failed");
  }
};

  // =====================
  // DELETE
  // =====================

  const handleDelete = async () => {
  if (!deleteId) return;

  try {
    await deleteCategoryMutation.mutateAsync(
      deleteId
    );

    toast.success("Category deleted");

    setDeleteId(null);
  } catch {
    toast.error("Delete not allowed");
  }
};

  // =====================
  // EDIT
  // =====================

  const handleEdit = (
    category: CategoryDTO
  ) => {
    setEditId(category.id);

    setForm({
      name: category.name,
      description:
        category.description,
      parentCategoryId:
        category.parentCategoryId,
      isActive: category.isActive,
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
      description: "",
      parentCategoryId: null,
      isActive: true,
    });
  };

  // =====================
  // FILTER
  // =====================

  const filtered = useMemo(() => {
    return categories.filter((c) =>
      c.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [categories, search]);

  // =====================
  // TREE
  // =====================

  const renderTree = (
    category: CategoryDTO
  ) => {
    return (
      <TreeItem
        key={category.id}
        itemId={String(category.id)}
        label={
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography>
              {category.name}
            </Typography>

            <Box>
              <IconButton
                size="small"
                onClick={() =>
                  handleEdit(category)
                }
              >
                <EditIcon
                  fontSize="small"
                />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  setForm({
                    ...form,
                    parentCategoryId:
                      category.id,
                  });

                  setOpen(true);
                }}
              >
                <AddIcon
                  fontSize="small"
                />
              </IconButton>

              {category.subCategories
                .length === 0 && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={() =>
                    setDeleteId(
                      category.id
                    )
                  }
                >
                  <DeleteIcon
                    fontSize="small"
                  />
                </IconButton>
              )}
            </Box>
          </Box>
        }
      >
        {category.subCategories?.map(
          renderTree
        )}
      </TreeItem>
    );
  };

  if (loading) {
    return (
      <Typography>
        Loading categories...
      </Typography>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Categories"
        subtitle="Manage categories tree"
        action={
          <Button
            variant="contained"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            Add Category
          </Button>
        }
      />

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search categories"
      />

      {filtered.length === 0 ? (
        <EmptyState text="No categories found" />
      ) : (
        <Paper sx={{ p: 2 }}>
          <SimpleTreeView>
            {filtered
              .filter(
                (c) =>
                  !c.parentCategoryId
              )
              .map(renderTree)}
          </SimpleTreeView>
        </Paper>
      )}

      {/* =====================
          FORM
      ===================== */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >
        <DialogTitle>
          {editId
            ? "Edit Category"
            : "Create Category"}
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
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <TextField
              multiline
              rows={3}
              label="Description"
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
            />

            <TextField
              select
              label="Parent Category"
              value={
                form.parentCategoryId ||
                ""
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  parentCategoryId:
                    e.target.value
                      ? Number(
                          e.target.value
                        )
                      : null,
                })
              }
            >
              <MenuItem value="">
                Root Category
              </MenuItem>

              {categories.map((c) => (
                <MenuItem
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    form.isActive
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isActive:
                        e.target
                          .checked,
                    })
                  }
                />
              }
              label="Active"
            />
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
            onClick={handleSave}
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
        title="Delete category?"
        description="This action cannot be undone"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}