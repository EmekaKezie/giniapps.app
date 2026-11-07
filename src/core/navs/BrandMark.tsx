import { Token } from "@mui/icons-material";
import { Box, Stack, Typography, alpha, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

type TProps = {
  compact?: boolean;
};

export default function BrandMark({ compact }: TProps) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      component={Link}
      to="/apps"
      sx={{ textDecoration: "none", color: "text.primary" }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.5,
          bgcolor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          flexShrink: 0,
        }}>
        <Token sx={{ color: "white", fontSize: 18 }} />
      </Box>
      {!compact && (
        <Typography
          sx={{ fontWeight: 900, letterSpacing: "-0.02em", fontSize: "1.1rem" }}
          noWrap>
          Ginimeg Apps
        </Typography>
      )}
    </Stack>
  );
}
