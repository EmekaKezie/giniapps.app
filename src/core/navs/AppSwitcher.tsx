import { useState, type MouseEvent } from "react";
import {
  Box,
  ButtonBase,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { AppsOutlined, Check, UnfoldMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGetApps } from "@api/appApi";
import type { IApiRes } from "@appTypes/IAap";
import type { IAppView } from "@appTypes/IApp";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import AppAvatar from "@components/common/AppAvatar";

export default function AppSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { app, app_id, loading } = useCurrentApp();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [apps, setApps] = useState<IAppView[] | null>(null);

  const handleOpen = async (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    if (apps === null) {
      try {
        const res: IApiRes<IAppView[]> = await apiGetApps();
        setApps(res?.status === "success" ? (res.data ?? []) : []);
      } catch {
        setApps([]);
      }
    }
  };

  const switchTo = (id: string) => {
    setAnchorEl(null);
    // keep the user on the same section (e.g. /smtp) when switching apps
    const section = location.pathname.split("/").slice(3).join("/");
    navigate(`/apps/${id}${section ? `/${section}` : ""}`);
  };

  return (
    <Box sx={{ px: 2, pb: 1 }}>
      <ButtonBase
        onClick={handleOpen}
        sx={{
          width: "100%",
          p: 1.25,
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          justifyContent: "space-between",
          textAlign: "left",
          "&:hover": { borderColor: "primary.main" },
        }}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          {loading && !app ? (
            <Skeleton variant="rounded" width={34} height={34} />
          ) : (
            <AppAvatar name={app?.app_name} logo={app?.app_logo} size={34} />
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {app?.app_name ?? (loading ? <Skeleton width={110} /> : "Unknown app")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: "block", fontFamily: "monospace" }}>
              {app?.app_code ?? app_id}
            </Typography>
          </Box>
        </Stack>
        <UnfoldMore sx={{ fontSize: 18, color: "text.secondary" }} />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              maxHeight: 420,
              mt: 1,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            },
          },
        }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ px: 2, fontWeight: 700, display: "block" }}>
          Switch app
        </Typography>
        {apps === null &&
          [1, 2, 3].map((i) => (
            <Box key={i} sx={{ px: 2, py: 1 }}>
              <Skeleton height={28} />
            </Box>
          ))}
        {apps?.map((a) => (
          <MenuItem
            key={a.app_id}
            selected={a.app_id === app_id}
            onClick={() => switchTo(a.app_id)}
            sx={{
              py: 1,
              gap: 1.25,
              "&.Mui-selected": {
                bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
              },
            }}>
            <AppAvatar name={a.app_name} logo={a.app_logo} size={26} />
            <Typography variant="body2" fontWeight={600} noWrap sx={{ flexGrow: 1 }}>
              {a.app_name}
            </Typography>
            {a.app_id === app_id && <Check fontSize="small" color="primary" />}
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/apps");
          }}
          sx={{ py: 1 }}>
          <ListItemIcon>
            <AppsOutlined fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={600}>
            View all apps
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
