// src/pages/Login.tsx
import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Container,
  Paper,
  Box,
  Typography,
} from "@mui/material";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const nevigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await login(data.username, data.password);

      toast.success("Logged in");
      nevigate("/");
    } catch (e: any) {
      toast.error(e);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              mb: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Sign in to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Username"
                fullWidth
                {...register("username")}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                {...register("password")}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  mt: 1,
                  py: 1.4,
                }}
              >
                Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}