import { Box, Divider, Drawer, IconButton, Stack, Tooltip } from "@mui/material";
import { AppsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthDrawerMenu, { AuthDrawerFooterMenu } from "./AuthDrawerMenu";
import AppSwitcher from "./AppSwitcher";
import BrandMark from "./BrandMark";
import UserMenu from "./UserMenu";

type TProps = {
  open: boolean;
  width: number;
  smallScreen: boolean;
  onClose: () => void;
};

export default function AuthDrawer({ open, width, smallScreen, onClose }: TProps) {
  const navigate = useNavigate();
  // close the temporary drawer on mobile after picking a page
  const onNavigate = smallScreen ? onClose : undefined;

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
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
      sx={{ width: open ? width : 0, flexShrink: 0 }}>
      {/* Brand + back to console */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
        <BrandMark />
        <Tooltip title="All apps">
          <IconButton size="small" onClick={() => navigate("/apps")}>
            <AppsOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Current app + switcher */}
      <AppSwitcher />

      {/* App-scoped navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1 }}>
        <AuthDrawerMenu onNavigate={onNavigate} />
      </Box>

      <AuthDrawerFooterMenu onNavigate={onNavigate} />
      <Divider sx={{ mx: 2, opacity: 0.6 }} />
      <UserMenu />
    </Drawer>
  );
}
