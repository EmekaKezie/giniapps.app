import { alpha, Box, LinearProgress, Stack, Typography } from "@mui/material";
// import Logo from "@assets/logo.png";
import { Token } from "@mui/icons-material";

type TProps = {
  message?: string;
};
export default function LoadingAlpha({ message }: TProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        // bgcolor: "common.black",
        //bgcolor: "rgba(0, 0, 0, 0.5)",
      }}>
      <Box>
        {/* <Box
          component="img"
          src={Logo}
          alt="loader"
          sx={{
            width: 100,
            animation: "slideAndZoom 2s ease-out forwards",
            "@keyframes slideAndZoom": {
              "0%": {
                transform: "translateX(-100vw) scale(1)",
              },
              "30%": {
                transform: "translateX(0) scale(1)",
              },
              "100%": {
                // Bumped the scale up to 2 for a deeper zoom
                transform: "translateX(0) scale(2)",
              },
            },
          }}
        /> */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShado: (theme) =>
                `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}>
            <Token sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            color="secondary"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              //color: "",
              fontSize: "1.3rem",
            }}>
            Ginivo
          </Typography>
        </Stack>
      </Box>
      <Box
        sx={{
          //border: 1,
          //py: 5,
          borderColor: "divider",
          mt: 2,
          width: 200,
          borderRadius: 5,
          textAlign: "center",
        }}>
        <LinearProgress />
        <br />
        {message && <Typography>{message}</Typography>}
      </Box>
    </Box>
  );
}
