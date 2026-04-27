import { useState, type MouseEvent } from "react";
import {
  Box,
  Typography,
  alpha,
  Stack,
  Avatar,
  ButtonBase,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  PersonOutline,
  SettingsOutlined,
  LogoutOutlined,
  DarkModeOutlined,
  LightModeOutlined,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@redux/useRedux";
import { onToggleTheme } from "@redux/slices/themeSlice";
import { AUTH_EMAIL, AUTH_FIRSTNAME, AUTH_LASTNAME } from "@core/storage/authstorage";

export default function UserMenu() {
  const dispatch = useAppDispatch();
  const themeStore = useAppSelector((state) => state.themeReducer);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleToggleTheme = () => {
    dispatch(onToggleTheme());
  };

  return (
    <Box sx={{ p: 2 }}>
      <ButtonBase
        onClick={handleOpen}
        sx={{
          width: "100%",
          p: 1,
          borderRadius: 3,
          justifyContent: "space-between",
          transition: "0.2s",
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
          },
        }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ overflow: "hidden" }}>
          <Avatar
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80"
            sx={{
              width: 36,
              height: 36,
              border: 1,
              borderColor: "divider",
            }}
          />
          <Box sx={{ textAlign: "left", overflow: "hidden" }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {AUTH_FIRSTNAME()} {AUTH_LASTNAME()}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}>
              {AUTH_EMAIL()}
            </Typography>
          </Box>
        </Stack>
        <MoreVert sx={{ fontSize: 18, color: "text.disabled" }} />
      </ButtonBase>

      {/* User Options Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              width: 200,
              mb: 1,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}>
        <MenuItem onClick={handleClose} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <PersonOutline fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>
            Profile
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>
            Settings
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleToggleTheme();
            handleClose();
          }}
          sx={{ py: 1.2 }}>
          <ListItemIcon>
            {themeStore.darkTheme ? (
              <LightModeOutlined fontSize="small" />
            ) : (
              <DarkModeOutlined fontSize="small" />
            )}
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>
            {themeStore.darkTheme ? "Light Mode" : "Dark Mode"}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleClose} sx={{ py: 1.2, color: "error.main" }}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
