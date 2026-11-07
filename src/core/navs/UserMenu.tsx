import { useState, type MouseEvent } from "react";
import {
  Box,
  Typography,
  alpha,
  Stack,
  Avatar,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  MoreVert,
  AppsOutlined,
  LogoutOutlined,
  DarkModeOutlined,
  LightModeOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@redux/useRedux";
import { onToggleTheme } from "@redux/slices/themeSlice";
import {
  AUTH_EMAIL,
  AUTH_FIRSTNAME,
  AUTH_LASTNAME,
  clearAuthStorage,
} from "@core/storage/authstorage";
import { initials } from "@core/helper/format";

type TProps = {
  /** "drawer" = full row at the bottom of the drawer, "avatar" = top-bar icon */
  variant?: "drawer" | "avatar";
};

export default function UserMenu({ variant = "drawer" }: TProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeStore = useAppSelector((state) => state.themeReducer);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const fullName = `${AUTH_FIRSTNAME() ?? ""} ${AUTH_LASTNAME() ?? ""}`.trim();
  const avatar = (
    <Avatar
      sx={{
        width: 36,
        height: 36,
        fontSize: 14,
        fontWeight: 700,
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}>
      {initials(AUTH_FIRSTNAME(), AUTH_LASTNAME())}
    </Avatar>
  );

  const handleLogout = () => {
    handleClose();
    clearAuthStorage();
    navigate("/auth/login/authourize", { replace: true });
  };

  return (
    <Box sx={variant === "drawer" ? { p: 2 } : undefined}>
      {variant === "drawer" ? (
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
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ overflow: "hidden" }}>
            {avatar}
            <Box sx={{ textAlign: "left", overflow: "hidden" }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                {fullName || "Signed in"}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                {AUTH_EMAIL()}
              </Typography>
            </Box>
          </Stack>
          <MoreVert sx={{ fontSize: 18, color: "text.disabled" }} />
        </ButtonBase>
      ) : (
        <IconButton onClick={handleOpen} sx={{ p: 0.5 }}>
          {avatar}
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={
          variant === "drawer"
            ? { vertical: "top", horizontal: "right" }
            : { vertical: "bottom", horizontal: "right" }
        }
        transformOrigin={
          variant === "drawer"
            ? { vertical: "bottom", horizontal: "right" }
            : { vertical: "top", horizontal: "right" }
        }
        slotProps={{
          paper: {
            sx: {
              width: 240,
              my: 1,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}>
        {variant === "avatar" && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {fullName || "Signed in"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
              {AUTH_EMAIL()}
            </Typography>
          </Box>
        )}
        {variant === "avatar" && <Divider sx={{ my: 1 }} />}
        {variant === "drawer" && (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/apps");
            }}
            sx={{ py: 1.2 }}>
            <ListItemIcon>
              <AppsOutlined fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2" fontWeight={500}>
              All apps
            </Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            dispatch(onToggleTheme());
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
            {themeStore.darkTheme ? "Light mode" : "Dark mode"}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: "error.main" }}>
          <ListItemIcon>
            <LogoutOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            Sign out
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
