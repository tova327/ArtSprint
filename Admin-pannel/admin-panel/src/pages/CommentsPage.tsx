import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

import {
  getComments,
  deleteComment,
} from "../api/commentsApi";

import { getUsers } from "../api/usersApi";
import { getPaintings } from "../api/paintingsApi";



import { toast } from "sonner";

import PageHeader from "../components/common/PageHeader";
import SearchBox from "../components/common/SearchBox";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { CommentDTO } from "../types/comment.types";
import type { PaintingDTO } from "../types/painting.types";
import type { UserDTO } from "../types/user.types";

export default function CommentsPage() {
  const [comments, setComments] = useState<
    CommentDTO[]
  >([]);

  const [users, setUsers] = useState<UserDTO[]>(
    []
  );

  const [paintings, setPaintings] =
    useState<PaintingDTO[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  // =====================
  // LOAD
  // =====================

  const load = async () => {
    try {
      setLoading(true);

      const [
        commentsRes,
        usersRes,
        paintingsRes,
      ] = await Promise.all([
        getComments(),
        getUsers(),
        getPaintings(),
      ]);

      setComments(commentsRes.data);

      setUsers(usersRes.data);

      setPaintings(paintingsRes.data);
    } catch {
      toast.error("Failed loading comments");
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

  const getPaintingName = (id: number) => {
    return (
      paintings.find((p) => p.id === id)
        ?.name || "Unknown"
    );
  };

  // =====================
  // DELETE
  // =====================

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteComment(deleteId);

      toast.success("Comment deleted");

      setDeleteId(null);

      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  // =====================
  // FILTER
  // =====================

  const filtered = useMemo(() => {
    return comments.filter((c) => {
      const text = `
        ${c.content}
        ${getUserName(c.userId)}
        ${getPaintingName(c.paintId)}
      `.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });
  }, [comments, search]);

  if (loading) {
    return (
      <Typography>
        Loading comments...
      </Typography>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Comments"
        subtitle="Manage users comments"
      />

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search comments"
      />

      {filtered.length === 0 ? (
        <EmptyState text="No comments found" />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Comment
                </TableCell>

                <TableCell>
                  User
                </TableCell>

                <TableCell>
                  Painting
                </TableCell>

                <TableCell>
                  Created
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {c.content}
                  </TableCell>

                  <TableCell>
                    {getUserName(c.userId)}
                  </TableCell>

                  <TableCell>
                    {getPaintingName(
                      c.paintId
                    )}
                  </TableCell>

                  <TableCell>
                    {new Date(
                      c.createdAt
                    ).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {c.content &&
                    c.content.length > 80 ? (
                      <Chip
                        label="Long"
                        color="warning"
                      />
                    ) : (
                      <Chip
                        label="Normal"
                        color="success"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <Button
                      color="error"
                      onClick={() =>
                        setDeleteId(c.id)
                      }
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete comment?"
        description="This action cannot be undone"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}