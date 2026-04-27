import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";

export default function LoadingTabular() {
  // Create an array of 6 items to simulate rows
  const rows = Array.from(new Array(6));

  return (
    <Box sx={{}}>
      {/* 1. Header Skeleton */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 6,
          alignItems: "center",
        }}>
        <Box sx={{ width: "40%" }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="90%" height={20} />
        </Box>
        <Box>
          <Skeleton
            variant="rounded"
            width={180}
            height={45}
            sx={{ borderRadius: 3 }}
          />
        </Box>
      </Box>

      {/* 2. Table Skeleton */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.50" }}>
            <TableRow>
              <TableCell>
                <Skeleton width="40%" />
              </TableCell>
              <TableCell>
                <Skeleton width="30%" />
              </TableCell>
              <TableCell>
                <Skeleton width="30%" />
              </TableCell>
              <TableCell align="right">
                <Skeleton width="20%" sx={{ ml: "auto" }} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((_, index) => (
              <TableRow key={index}>
                {/* Column 1: Item with Icon mimic */}
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton
                      variant="rounded"
                      width={36}
                      height={36}
                      sx={{ borderRadius: 2 }}
                    />
                    <Skeleton width={140} />
                  </Stack>
                </TableCell>
                {/* Column 2: Price */}
                <TableCell>
                  <Skeleton width={80} />
                </TableCell>
                {/* Column 3: Date */}
                <TableCell>
                  <Skeleton width={100} />
                </TableCell>
                {/* Column 4: Actions */}
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Skeleton variant="circular" width={28} height={28} />
                    <Skeleton variant="circular" width={28} height={28} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
