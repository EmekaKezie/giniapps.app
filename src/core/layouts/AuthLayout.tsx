import { Box, Button, Stack, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { ErrorOutline } from "@mui/icons-material";
import AuthDrawer from "@core/navs/AuthDrawer";
import AuthNavbar from "@core/navs/AuthNavbar";
import { CurrentAppContext } from "@core/context/CurrentAppContext";
import { apiGetAppById } from "@api/appApi";
import type { IApiRes } from "@appTypes/IAap";
import type { IAppView } from "@appTypes/IApp";
import { handleApiError } from "@core/helper/apiErrorHandler";
import LoadingCircular from "@core/loaders/LoadingCircular";

/**
 * Workspace layout for a single app (`/apps/:app_id/*`).
 * Loads the app once and shares it with every page via `useCurrentApp()`.
 */
export default function AuthLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { app_id = "" } = useParams();
  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const drawerWidth = 272;

  const [openDrawer, setOpenDrawer] = useState(!smallScreen);
  const [app, setApp] = useState<IAppView>();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setOpenDrawer(!smallScreen);
  }, [smallScreen]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res: IApiRes<IAppView> = await apiGetAppById(app_id);
      if (res?.status === "success" && res.data) {
        setApp(res.data);
      } else {
        setFailed(true);
        handleApiError(res, enqueueSnackbar);
      }
    } catch {
      setFailed(true);
      enqueueSnackbar("Error fetching app. Please check your internet", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [app_id]);

  useEffect(() => {
    setApp(undefined);
    refresh();
  }, [refresh]);

  const ctx = useMemo(() => ({ app_id, app, loading, refresh }), [app_id, app, loading, refresh]);

  return (
    <CurrentAppContext.Provider value={ctx}>
      <Box sx={{ display: "flex" }}>
        <AuthDrawer
          open={openDrawer}
          width={drawerWidth}
          smallScreen={smallScreen}
          onClose={() => setOpenDrawer((p) => !p)}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            minHeight: "100vh",
            bgcolor: "background.paper",
          }}>
          {smallScreen && <AuthNavbar onToggle={() => setOpenDrawer((p) => !p)} />}
          {smallScreen && <Toolbar />}

          <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1280, mx: "auto" }}>
            {!app && loading ? (
              <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LoadingCircular />
              </Box>
            ) : !app && failed ? (
              <Stack alignItems="center" spacing={2} sx={{ py: 12, textAlign: "center" }}>
                <ErrorOutline sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography variant="h6" fontWeight={700}>
                  We couldn't load this app
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  It may have been deleted, or you may not have access to it.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => navigate("/apps")}>
                    All apps
                  </Button>
                  <Button variant="contained" disableElevation onClick={refresh}>
                    Try again
                  </Button>
                </Stack>
              </Stack>
            ) : (
              <Outlet />
            )}
          </Box>
        </Box>
      </Box>
    </CurrentAppContext.Provider>
  );
}
