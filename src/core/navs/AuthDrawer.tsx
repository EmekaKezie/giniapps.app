import {
  Box,
  Drawer,
  Typography,
  alpha,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import { Token } from "@mui/icons-material";
import AuthDrawerMenu from "./AuthDrawerMenu";
import UserMenu from "./UserMenu";

type TProps = {
  open: boolean;
  width: number;
  smallScreen: boolean;
  onClose: () => void;
};

export default function AuthDrawer({
  open,
  width,
  smallScreen,
  onClose,
}: TProps) {
  const theme = useTheme();

  return (
    <Drawer
      variant={smallScreen ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: open ? width : 0,
            boxSizing: "border-box",
            bgcolor: "background.default",
            borderRight: "1px solid",
            //border:0,
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            
          },
        },
      }}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
      }}>
      {/* 1. BRAND LOGO SECTION */}
      <Box sx={{ p: 3 }}>
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
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}>
            <Token sx={{ color: "white", fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "text.primary",
              fontSize: "1.25rem",
            }}>
            Gini Apps
          </Typography>
        </Stack>
      </Box>

      {/* 2. COMPANY SWITCHER SECTION */}
      {/* <WorkspaceSwitch width={width} /> */}

      {/* 3. NAVIGATION MENU (Scrollable) */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1, mt: 1 }}>
        <AuthDrawerMenu />
      </Box>

      {/* 4. USER PROFILE SECTION (Fixed at Bottom) */}
      <Divider sx={{ mx: 2, opacity: 0.6 }} />
      <UserMenu />
    </Drawer>
  );
}
