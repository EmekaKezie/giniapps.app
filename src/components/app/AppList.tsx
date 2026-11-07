import { apiGetApps } from "@api/appApi";
import type { IApiRes } from "@appTypes/IAap";
import type { IAppView } from "@appTypes/IApp";
import { handleApiError } from "@core/helper/apiErrorHandler";
import { formatDate } from "@core/helper/format";
import { AUTH_FIRSTNAME } from "@core/storage/authstorage";
import {
  Add,
  AppsOutlined,
  Search,
  VerifiedUserOutlined,
  ArrowForward,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateAppDialog from "./CreateAppDialog";
import AppAvatar from "@components/common/AppAvatar";

type TFilter = "all" | "live" | "staging" | "inactive";

export default function AppList() {
  const navigate = useNavigate();

  const [appList, setAppList] = useState<IAppView[]>([]);
  const [appLoading, setAppLoading] = useState(true);
  const [openCreateApp, setOpenCreateApp] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TFilter>("all");

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setAppLoading(true);
    try {
      const res: IApiRes<IAppView[]> = await apiGetApps();
      if (res?.status === "success") {
        setAppList(res?.data ?? []);
      } else {
        handleApiError(res, enqueueSnackbar);
      }
    } catch {
      enqueueSnackbar("Error fetching apps. Please check your internet", {
        variant: "default",
        anchorOrigin: { horizontal: "left", vertical: "bottom" },
      });
    } finally {
      setAppLoading(false);
    }
  };

  const counts = useMemo(
    () => ({
      all: appList.length,
      live: appList.filter((a) => a.is_live === 1).length,
      staging: appList.filter((a) => a.is_live !== 1).length,
      inactive: appList.filter((a) => a.is_active !== 1).length,
    }),
    [appList],
  );

  const visibleApps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appList.filter((a) => {
      if (filter === "live" && a.is_live !== 1) return false;
      if (filter === "staging" && a.is_live === 1) return false;
      if (filter === "inactive" && a.is_active === 1) return false;
      if (!q) return true;
      return (
        a.app_name?.toLowerCase().includes(q) ||
        a.app_code?.toLowerCase().includes(q)
      );
    });
  }, [appList, search, filter]);

  return (
    <Box>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "flex-end" }}
        spacing={2}
        sx={{ mb: 4 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Welcome back{AUTH_FIRSTNAME() ? `, ${AUTH_FIRSTNAME()}` : ""}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.02em" }}>
            Your applications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Pick an app to manage its credentials, users, messaging and settings.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={<Add />}
          onClick={() => setOpenCreateApp(true)}
          sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none", px: 3 }}>
          New app
        </Button>
      </Stack>

      {/* Toolbar */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by name or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: "100%", md: 340 }, bgcolor: "background.paper" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={filter}
          onChange={(_, v) => v && setFilter(v)}
          sx={{
            bgcolor: "background.paper",
            "& .MuiToggleButton-root": { textTransform: "none", px: 2, fontWeight: 600 },
          }}>
          <ToggleButton value="all">All · {counts.all}</ToggleButton>
          <ToggleButton value="live">Live · {counts.live}</ToggleButton>
          <ToggleButton value="staging">Staging · {counts.staging}</ToggleButton>
          <ToggleButton value="inactive">Inactive · {counts.inactive}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Grid */}
      <Grid container spacing={2}>
        {appLoading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Skeleton variant="rounded" width={48} height={48} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton width="70%" />
                    <Skeleton width="40%" />
                  </Box>
                </Stack>
                <Skeleton sx={{ mt: 3 }} width="55%" />
              </Card>
            </Grid>
          ))}

        {!appLoading &&
          visibleApps.map((app) => (
            <Grid key={app.app_id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  transition: "0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: (t) => `0 8px 24px ${alpha(t.palette.primary.main, 0.12)}`,
                    "& .open-arrow": { opacity: 1, transform: "translateX(0)" },
                  },
                }}>
                <CardActionArea
                  onClick={() => navigate(`/apps/${app.app_id}`)}
                  sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AppAvatar name={app.app_name} logo={app.app_logo} size={48} />
                    <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                      <Typography fontWeight={700} noWrap>
                        {app.app_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ fontFamily: "monospace", display: "block" }}>
                        {app.app_code}
                      </Typography>
                    </Box>
                    <ArrowForward
                      className="open-arrow"
                      fontSize="small"
                      sx={{
                        color: "primary.main",
                        opacity: 0,
                        transform: "translateX(-4px)",
                        transition: "0.2s",
                      }}
                    />
                  </Stack>

                  <Box sx={{ flexGrow: 1 }} />

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2.5, flexWrap: "wrap", rowGap: 1 }}>
                    <Chip
                      size="small"
                      label={app.is_live === 1 ? "Live" : "Staging"}
                      color={app.is_live === 1 ? "success" : "default"}
                      variant={app.is_live === 1 ? "filled" : "outlined"}
                      sx={{ fontWeight: 700, height: 22 }}
                    />
                    {app.is_active !== 1 && (
                      <Chip size="small" label="Inactive" color="warning" variant="outlined" sx={{ fontWeight: 700, height: 22 }} />
                    )}
                    {app.generated_license && (
                      <Chip
                        size="small"
                        icon={<VerifiedUserOutlined />}
                        label="Licensed"
                        variant="outlined"
                        sx={{ fontWeight: 600, height: 22 }}
                      />
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    {app.created_date && (
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(app.created_date)}
                      </Typography>
                    )}
                  </Stack>
                </CardActionArea>
              </Card>
            </Grid>
          ))}

        {/* "Create" tile, always last */}
        {!appLoading && !search && filter === "all" && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                height: "100%",
                minHeight: 140,
                borderStyle: "dashed",
                bgcolor: "transparent",
                "&:hover": { borderColor: "primary.main" },
              }}>
              <CardActionArea
                onClick={() => setOpenCreateApp(true)}
                sx={{ height: "100%", p: 2.5, display: "flex", flexDirection: "column", gap: 1, color: "text.secondary" }}>
                <Add />
                <Typography variant="body2" fontWeight={700}>
                  Register a new app
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
        )}
      </Grid>

      {!appLoading && visibleApps.length === 0 && (search || filter !== "all") && (
        <Stack alignItems="center" spacing={1} sx={{ py: 8, color: "text.secondary" }}>
          <AppsOutlined sx={{ fontSize: 40, color: "text.disabled" }} />
          <Typography fontWeight={700} color="text.primary">
            No apps match
          </Typography>
          <Typography variant="body2">Try a different search or filter.</Typography>
        </Stack>
      )}

      {openCreateApp && (
        <CreateAppDialog
          open={openCreateApp}
          onClose={() => setOpenCreateApp(false)}
          onSuccess={() => {
            setOpenCreateApp(false);
            fetchApps();
          }}
        />
      )}
    </Box>
  );
}
