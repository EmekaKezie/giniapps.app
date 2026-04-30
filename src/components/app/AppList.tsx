import { apiGetApps } from "@api/appApi";
import type { IApiRes } from "@appTypes/IAap";
import type { IAppView } from "@appTypes/IApp";
import { handleApiError } from "@core/helper/apiErrorHandler";
import LoadingCircular from "@core/loaders/LoadingCircular";
import {
  Add,
  ArrowForwardIos,
  Laptop,
  PhoneIphone,
  Language,
} from "@mui/icons-material";
import {
  Box,
  Fab,
  Stack,
  Typography,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateAppDialog from "./CreateAppDialog";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Desktop":
      return <Laptop fontSize="small" />;
    case "Mobile":
      return <PhoneIphone fontSize="small" />;
    default:
      return <Language fontSize="small" />;
  }
};

export default function AppList() {
  const navigate = useNavigate();

  const [appList, setAppList] = useState<IAppView[]>([]);
  const [appLoading, setAppLoading] = useState(false);
  const [openCreateApp, setOpenCreateApp] = useState(false);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    setAppLoading(true);
    try {
      const res: IApiRes<IAppView[]> = await apiGetApps();
      if (res?.status === "success") {
        setAppList(res?.data!);
      } else {
        handleApiError(res, enqueueSnackbar);
      }
    } catch (error) {
      enqueueSnackbar("Error fetching apps. Please check your internet", {
        variant: "default",
        anchorOrigin: { horizontal: "left", vertical: "bottom" },
      });
    } finally {
      setAppLoading(false);
    }
  };

  const handleAppClick = (appId: string) => {
    navigate(`./${appId}`);
  };

  if (appLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <LoadingCircular />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Application Manager
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your apps and generate security licenses.
          </Typography>
        </Box>
      </Stack>

      {/* App List */}
      <Stack spacing={2}>
        {appList.map((i) => (
          <Card
            key={i.app_id}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              transition: "0.2s",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                borderColor: "primary.main",
              },
            }}>
            <CardActionArea
              onClick={() => handleAppClick(i.app_id)}
              sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                {/* App Icon */}
                <Avatar
                  sx={{
                    bgcolor: "primary.light",
                    color: "primary.main",
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                  }}>
                  {i?.app_name.charAt(0)}
                </Avatar>

                {/* App Details */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="600">
                    {i?.app_name}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "text.secondary",
                        gap: 0.5,
                      }}>
                      {getTypeIcon("web")}
                      <Typography variant="caption">{"web"}</Typography>
                    </Box>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ mx: 0.5, height: 12, alignSelf: "center" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {i.generated_license ? "License Available" : ""}
                    </Typography>
                  </Stack>
                </Box>

                {/* Status & Arrow */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip
                    label={i.is_active === 1 ? "success" : "warning"}
                    size="small"
                    color={i.is_active === 1 ? "success" : "warning"}
                    //variant="soft" // If using MUI Joy or custom theme, otherwise use "outlined"
                    sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                  />
                  <ArrowForwardIos
                    sx={{ fontSize: 16, color: "action.disabled" }}
                  />
                </Stack>
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      {/* Floating Action Button */}
      <Stack
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        spacing={2}
        alignItems="flex-end">
        <Fab
          color="primary"
          variant="extended"
          onClick={() => setOpenCreateApp(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            px: 3,
            boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
          }}>
          <Add sx={{ mr: 1 }} /> New App
        </Fab>
      </Stack>

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
