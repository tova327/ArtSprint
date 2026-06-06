// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";
import { Box, Typography, Paper } from "@mui/material";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    paintings: 0,
    categories: 0,
    comments: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [users, paintings, categories, comments] = await Promise.all([
          axiosClient.get("/user"),
          axiosClient.get("/painting"),
          axiosClient.get("/category"),
          axiosClient.get("/comment"),
        ]);

        setStats({
          users: users.data.length,
          paintings: paintings.data.length,
          categories: categories.data.length,
          comments: comments.data.length,
        });
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  return (
    <>
    
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="h3">Dashboard</Typography>
      {Object.entries(stats).map(([key, value]) => (
        <Paper key={key} sx={{ p: 3, minWidth: 150 }}>
          <Typography variant="h6">{key}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Paper>
      ))}
    </Box></>
  );
}