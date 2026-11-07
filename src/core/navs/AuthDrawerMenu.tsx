import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import type { IAppMenuItem } from "@appTypes/IAap";
import { APP_MENU, APP_MENU_FOOTER } from "@router/appMenu";

type TItemProps = {
  item: IAppMenuItem;
  onNavigate?: () => void;
};

function DrawerItem({ item, onNavigate }: TItemProps) {
  const theme = useTheme();
  const { app_id } = useParams();
  const to = `/apps/${app_id}${item.path ? `/${item.path}` : ""}`;

  return (
    <NavLink to={to} end={item.path === ""} style={{ textDecoration: "none" }} onClick={onNavigate}>
      {({ isActive }) => (
        <ListItemButton
          sx={{
            borderRadius: 2,
            py: 0.75,
            bgcolor: isActive ? theme.palette.primary.light : "transparent",
            color: isActive ? "primary.main" : "text.primary",
            "&:hover": {
              bgcolor: isActive
                ? alpha(theme.palette.primary.main, 0.18)
                : alpha(theme.palette.text.primary, 0.05),
            },
          }}>
          <ListItemIcon sx={{ minWidth: 38, color: "inherit", "& svg": { fontSize: 20 } }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText
            sx={{ m: 0 }}
            primary={
              <Typography
                variant="body2"
                sx={{ fontWeight: isActive ? 800 : 500, whiteSpace: "nowrap" }}>
                {item.label}
              </Typography>
            }
          />
        </ListItemButton>
      )}
    </NavLink>
  );
}

type TProps = {
  onNavigate?: () => void;
};

export function AuthDrawerFooterMenu({ onNavigate }: TProps) {
  return (
    <List sx={{ px: 1, py: 0.5 }}>
      {APP_MENU_FOOTER.map((item) => (
        <DrawerItem key={item.id} item={item} onNavigate={onNavigate} />
      ))}
    </List>
  );
}

export default function AuthDrawerMenu({ onNavigate }: TProps) {
  return (
    <Box>
      {APP_MENU.map((group, gi) => (
        <Box key={gi} sx={{ mt: group.label ? 1.5 : 0 }}>
          {group.label && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ px: 2, fontWeight: 700, fontSize: "0.68rem", letterSpacing: "0.08em" }}>
              {group.label}
            </Typography>
          )}
          <List sx={{ px: 1, py: 0, display: "flex", flexDirection: "column", gap: 0.25 }}>
            {group.items.map((item) => (
              <DrawerItem key={item.id} item={item} onNavigate={onNavigate} />
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
}
