import { Grid, Box, Skeleton } from "@mui/material";

type TProps = {
  count?: number;
};

export default function SkeletonLoaderGrid(props: TProps) {
  const count = props.count ?? 3;
  const placeholders = Array.from(new Array(count));

  return (
    <Grid container spacing={3}>
      {placeholders.map((_, index) => (
        <Grid key={index} size={{ lg: 4, md: 4, sm: 6, xs: 12 }}>
          <Box>
            <Skeleton variant="rectangular" height={200} />
            <Box sx={{ pt: 0.5 }}>
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton
                variant="text"
                width="60%"
                sx={{ fontSize: "0.875rem" }}
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
