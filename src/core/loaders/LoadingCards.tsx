import {
  Box,
  Skeleton,
  Paper,
  Stack,
  Grid, // Using MUI Grid2 for modern layout
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function LoadingCards() {
  const theme = useTheme();
  // Create an array of 6 items to simulate card list
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const cardItems = Array.from(new Array(4));

  return (
    <Box sx={{}}>
      {/* 1. Header Skeleton (Kept consistent with your previous layout) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          mb: 6,
          gap: 3,
          alignItems: { xs: "flex-start", sm: "center" },
        }}>
        <Box sx={{ width: { xs: "100%", sm: "40%" } }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
          <Skeleton
            variant="rounded"
            width={smallScreen ? "100%" : 180}
            height={45}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </Box>

      {/* 2. Card Grid Skeleton */}
      <Grid container spacing={3}>
        {cardItems.map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}>
              <Stack spacing={2.5}>
                {/* Top Section: Icon and Title */}
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Skeleton
                    variant="rounded"
                    width={48}
                    height={48}
                    sx={{ borderRadius: 2.5, flexShrink: 0 }}
                  />
                  <Box sx={{ flexGrow: 1, pt: 0.5 }}>
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={24}
                      sx={{ mb: 0.5 }}
                    />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Stack>

                {/* Middle Section: Details */}
                <Box>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="90%" />
                </Box>

                {/* Bottom Section: Metadata and Actions */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    pt: 2,
                    borderTop: 1,
                    borderColor: "divider",
                  }}>
                  <Box sx={{ width: "40%" }}>
                    <Skeleton variant="text" width="100%" height={20} />
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
