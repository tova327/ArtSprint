import { TextField } from "@mui/material";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBox({
  value,
  onChange,
  placeholder,
}: Props) {
  return (
    <TextField
      fullWidth
      size="small"
      label={placeholder || "Search"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mb: 2 }}
      autoComplete="off"
    />
  );
}