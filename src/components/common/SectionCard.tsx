import { Box, Card, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type TProps = {
  title?: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
  danger?: boolean;
};

export default function SectionCard({
  title,
  subtitle,
  icon,
  actions,
  children,
  noPadding,
  danger,
}: TProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: danger ? "error.main" : "divider",
        overflow: "hidden",
      }}>
      {title && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 3, pt: 2.5, pb: noPadding ? 2 : 0 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {icon && (
              <Box sx={{ color: danger ? "error.main" : "primary.main", display: "flex" }}>
                {icon}
              </Box>
            )}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color={danger ? "error.main" : "text.primary"}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Stack>
          {actions}
        </Stack>
      )}
      <Box sx={noPadding ? undefined : { p: 3 }}>{children}</Box>
    </Card>
  );
}
