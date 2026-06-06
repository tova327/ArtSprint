// src/components/layout/Sidebar.tsx
import { List, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();

  return (
    <List sx={{ width: 200 }}>
      <ListItemButton onClick={() => nav("/")}>Dashboard</ListItemButton>
      <ListItemButton onClick={() => nav("/users")}>Users</ListItemButton>
      <ListItemButton onClick={() => nav("/paintings")}>Paintings</ListItemButton>
      <ListItemButton onClick={() => nav("/categories")}>Categories</ListItemButton>
      <ListItemButton onClick={() => nav("/comments")}>Comments</ListItemButton>
    </List>
  );
}