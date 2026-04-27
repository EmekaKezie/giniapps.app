import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  alpha,
  useTheme,
  Stack,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import QuickCreate from "./QuickCreate";

type TProps = {
  open: boolean;
  drawerWidth: number;
  smallScreen: boolean;
  onToggle: () => void;
};

export default function AuthNavbar({
  open,
  drawerWidth,
  smallScreen,
  onToggle,
}: TProps) {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 1),
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        zIndex: smallScreen ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: open && !smallScreen ? `calc(100% - ${drawerWidth}px)` : "100%",
        ml: open && !smallScreen ? `${drawerWidth}px` : 0,
      }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {smallScreen && (
          <IconButton onClick={onToggle} edge="start" sx={{ ml: 0 }}>
            <MenuIcon fontSize="large" />
          </IconButton>
        )}

        <Box>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "text.primary",
              fontSize: "1.25rem",
            }}>
            Gini Apps
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1.5} alignItems="center" mr={1}>
          <QuickCreate smallScreen={smallScreen} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
