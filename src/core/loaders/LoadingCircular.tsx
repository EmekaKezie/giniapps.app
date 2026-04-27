import { Box, CircularProgress, Typography } from "@mui/material";

type TProps = {
  message?: string;
};

export default function LoadingCircular({ message }: TProps) {
  return (
    <Box
      sx={{
        height: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="textSecondary">
          {!message ? "Loading ..." : message}
        </Typography>
      </Box>
    </Box>
  );
}
