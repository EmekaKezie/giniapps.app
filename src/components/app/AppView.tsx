import { apiGetAppById } from "@api/appApi"; // Assuming these exist
import type { IApiRes } from "@appTypes/IAap";
import type { IAppView } from "@appTypes/IApp";
import { handleApiError } from "@core/helper/apiErrorHandler";
import LoadingCircular from "@core/loaders/LoadingCircular";
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ContentCopy,
  Refresh,
  VpnKey,
  VerifiedUser,
  ArrowBack,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGenerateLicense, apiInspectLicense } from "@api/licenseApi";
import type {
  IGenerateLicenseRequest,
  IInspectLicenseRequest,
  IInspectLicenseResponse,
} from "@appTypes/ILicense";
import VerifyLicenseDialog from "./VerifyLicenseDialog";

export default function AppView() {
  const { app_id } = useParams();
  const navigate = useNavigate();

  const licenseTypes = ["temporal", "permanent"];

  const [app, setApp] = useState<IAppView>();
  const [appLoading, setAppLoading] = useState(false);
  const [days, setDays] = useState(30);
  const [selectedType, setSelectedType] = useState(licenseTypes[0]);
  const [genLicense, setGenLicense] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  const [openVerify, setOpenVerify] = useState(false);

  useEffect(() => {
    fetchApp();
  }, [app_id]);

  useEffect(() => {
    if (genLicense) {
      InspectApp();
    }
  }, [genLicense]);

  const fetchApp = async () => {
    setAppLoading(true);
    try {
      const res: IApiRes<IAppView> = await apiGetAppById(app_id!);
      if (res?.status === "success") {
        const appData = res.data!;
        setApp(appData);

        if (appData.generated_license) {
          setGenLicense(appData.generated_license);
        }
      } else {
        handleApiError(res, enqueueSnackbar);
      }
    } catch (error) {
      enqueueSnackbar("Error fetching app detail", { variant: "error" });
    } finally {
      setAppLoading(false);
    }
  };

  const InspectApp = async () => {
    try {
      const payload: IInspectLicenseRequest = {
        license: genLicense,
      };
      const res: IApiRes<IInspectLicenseResponse> =
        await apiInspectLicense(payload);

      setExpiry(res?.data?.expiry!);

      if (new Date().getTime() > new Date(res?.data?.expiry!).getTime()) {
        setIsExpired(true);
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`${label} copied to clipboard`, {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  const handleGenerateLicense = async () => {
    if (!app?.app_code) {
      return enqueueSnackbar("App Code is required", { variant: "warning" });
    }

    setIsGenerating(true);
    try {
      const payload: IGenerateLicenseRequest = {
        app_code: app.app_code!,
        valid_days: days,
        is_permanent: selectedType === licenseTypes[1] ? true : false,
      };
      const res = await apiGenerateLicense(payload);
      if (res.status === "success") {
        setGenLicense(res.data.license);
        enqueueSnackbar("License Generated", { variant: "success" });
      } else {
        handleApiError(res, enqueueSnackbar);
      }
    } catch (error) {
      enqueueSnackbar("Failed to generate license", { variant: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (appLoading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
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
      {/* Navigation & Header */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: "none" }}>
        Back to Apps
      </Button>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="800">
            {app?.app_name}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip
              label={app?.app_code}
              size="small"
              sx={{ fontFamily: "monospace" }}
            />
            <Chip
              label={app?.is_live ? "Live" : "Staging"}
              color={app?.is_live ? "success" : "default"}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>
      </Stack>

      <Stack spacing={4}>
        {/* API KEY SECTION */}
        <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <VpnKey color="primary" />
            <Typography variant="h6" fontWeight="700">
              API Credentials
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use this key to authenticate requests from your client applications.
            Keep this secret.
          </Typography>

          <TextField
            fullWidth
            label="API Key"
            value={app?.api_key || "No key generated"}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      copyToClipboard(app?.api_key || "", "API Key")
                    }>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "action.hover" }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2, textTransform: "none" }}
            startIcon={<Refresh />}>
            Rotate API Key
          </Button>
        </Card>

        {/* LICENSE GENERATOR SECTION */}
        <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <VerifiedUser color="primary" />
            <Typography variant="h6" fontWeight="700">
              License Generator
            </Typography>
          </Stack>

          <Box sx={{}}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This generates a signed Ed25519 license string for the app.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="App Code"
              placeholder="Enter App Code"
              value={app?.app_code}
              sx={{ width: { xs: "100%", md: "30%" } }}
            />

            <FormControl
              variant="outlined"
              sx={{ width: { xs: "100%", md: "25%" } }}>
              <InputLabel id="license-type-label">License Type</InputLabel>
              <Select
                labelId="license-type-label"
                value={selectedType}
                label="License Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ borderRadius: 2, textTransform: "capitalize" }}>
                {licenseTypes.map((type) => (
                  <MenuItem
                    key={type}
                    value={type}
                    sx={{ textTransform: "capitalize" }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Validity - 20% on large, Full on small */}
            <TextField
              label="Validity (Days)"
              type="number"
              disabled={selectedType === "permanent"}
              value={selectedType === "permanent" ? "" : days}
              onChange={(e) => setDays(Number(e.target.value))}
              sx={{ width: { xs: "100%", md: "20%" } }}
            />

            {/* Button - Remaining width on large, Full on small */}
            <Button
              variant="contained"
              disableElevation
              onClick={handleGenerateLicense}
              loading={isGenerating}
              sx={{
                px: 4,
                height: { md: "56px" }, // Matches TextField height on large screens
                width: { xs: "100%", md: "auto" },
                flexGrow: { md: 1 }, // Allows button to fill remaining space on row
              }}>
              {app?.generated_license ? "Regenerate" : "Generate"}
            </Button>
          </Stack>

          {genLicense && (
            <Paper
              variant="outlined"
              sx={{ p: 2, mt:2, bgcolor: "grey.50", position: "relative" }}>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{ mb: 1, fontWeight: "bold" }}>
                GENERATED LICENSE STRING
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  color: "success.main",
                  pr: 5,
                }}>
                {genLicense}
              </Typography>
              <IconButton
                onClick={() => copyToClipboard(genLicense, "License")}
                sx={{ position: "absolute", top: 8, right: 8 }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Paper>
          )}

          {genLicense && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Button
                variant="contained"
                color="info"
                size="small"
                disableElevation
                sx={{ textTransform: "none", borderRadius: 5 }}
                onClick={() => setOpenVerify(true)}>
                Apply License
              </Button>

              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="body2">Expiry:</Typography>{" "}
                <Typography
                  variant="body2"
                  color={isExpired ? "error" : "success"}
                  fontWeight={600}>
                  {new Date(expiry).toLocaleDateString("en-NG", {
                    dateStyle: "medium",
                    timeZone: "utc",
                  })}
                  {" @ "}
                  {new Date(expiry).toLocaleTimeString("en-NG", {
                    hour12: true,
                    timeStyle: "short",
                    timeZone: "utc",
                  })}
                </Typography>
              </Stack>
            </Box>
          )}
        </Card>
      </Stack>

      {openVerify && (
        <VerifyLicenseDialog
          open={openVerify}
          app={app!}
          onClose={() => setOpenVerify(false)}
          onSuccess={() => {
            fetchApp();
            setOpenVerify(false);
          }}
        />
      )}
    </Box>
  );
}
