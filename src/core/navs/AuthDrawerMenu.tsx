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
import { useMenu } from "@router/useMenu";
import { Link, useLocation } from "react-router-dom";

export default function AuthDrawerMenu() {
  const theme = useTheme();
  const location = useLocation();

  // Extracting the current root path for active state detection
  const currPath = location.pathname.split("/")[1];
  const menu = useMenu();

  return (
    <Box sx={{}}>
      {" "}
      {/* Provides the right-side gap for the pill shape */}
      <List sx={{ p: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {menu
          ?.filter?.((x) => x.group === "admin" && x.visible)
          ?.map((i, index) => {
            const path = i.url?.split("/")[1];
            const isCurrent: boolean =
              currPath?.toLowerCase() === path?.toLowerCase();

            return (
              <ListItemButton
                key={index}
                component={Link}
                to={i.url}
                sx={{
                  borderRadius: 2,
                  bgcolor: isCurrent
                    ? theme.palette.primary.light
                    : "transparent",
                  color: isCurrent ? "primary.main" : "text.primary",

                  "&:hover": {
                    bgcolor: isCurrent
                      ? alpha(theme.palette.primary.main, 0.18)
                      : alpha(theme.palette.action.hover, 0.04),
                    color: isCurrent ? "primary.main" : "text.primary",
                  },
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 44,
                    color: "inherit",
                    "& svg": {
                      fontSize: 22,
                    },
                  }}>
                  {i?.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isCurrent ? 800 : 500,
                        fontSize: "0.875rem", 
                        whiteSpace: "nowrap",
                      }}>
                      {i?.displayName}
                    </Typography>
                  }
                  sx={{ m: 0 }}
                />
              </ListItemButton>
            );
          })}
      </List>
    </Box>
  );
}
