import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import AppAvatar from "@components/common/AppAvatar";

type TProps = {
  onToggle: () => void;
};

/** Mobile-only top bar for the app workspace. */
export default function AuthNavbar({ onToggle }: TProps) {
  const { app } = useCurrentApp();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}>
      <Toolbar sx={{ gap: 1.5 }}>
        <IconButton onClick={onToggle} edge="start">
          <MenuIcon />
        </IconButton>
        {app && <AppAvatar name={app.app_name} logo={app.app_logo} size={28} />}
        <Typography fontWeight={800} noWrap>
          {app?.app_name ?? "Ginimeg Apps"}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
