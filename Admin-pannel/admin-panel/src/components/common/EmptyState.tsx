import { Box, Typography } from "@mui/material";

type Props = {
  text: string;
};

export default function EmptyState({
  text,
}: Props) {
  return (
    <Box
      sx={{
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
}