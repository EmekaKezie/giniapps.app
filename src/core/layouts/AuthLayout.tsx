import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect, type ReactNode } from "react";
import AuthDrawer from "@core/navs/AuthDrawer";
import AuthNavbar from "@core/navs/AuthNavbar";

type TProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: TProps) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = 260;

  // Initialize state based on screen size
  const [openDrawer, setOpenDrawer] = useState(!smallScreen);

  // Sync state ONLY when switching between mobile and desktop views
  useEffect(() => {
    if (!smallScreen) {
      setOpenDrawer(true);
    } else {
      setOpenDrawer(false);
    }
  }, [smallScreen]);

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Drawer Component */}
      <AuthDrawer
        open={openDrawer}
        width={drawerWidth}
        smallScreen={smallScreen}
        onClose={toggleDrawer}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: openDrawer ? `calc(100% - ${drawerWidth}px)` : "100%",
          },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}>
        {smallScreen && (
          <AuthNavbar
            open={openDrawer}
            drawerWidth={drawerWidth}
            smallScreen={smallScreen}
            onToggle={toggleDrawer}
          />
        )}

        <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
          {smallScreen && <Toolbar />}
          <Box
            sx={{
              bgcolor: "background.paper",
              minHeight: "100vh",
            }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
