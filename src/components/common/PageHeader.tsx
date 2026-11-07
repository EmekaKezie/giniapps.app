import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type TProps = {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
};

export default function PageHeader({ title, subtitle, actions }: TProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      sx={{ mb: 3 }}>
      <Box>
        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-0.01em" }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
