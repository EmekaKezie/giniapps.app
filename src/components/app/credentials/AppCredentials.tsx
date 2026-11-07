import type { IApiRes } from "@appTypes/IAap";
import { handleApiError } from "@core/helper/apiErrorHandler";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  ContentCopy,
  Refresh,
  VpnKey,
  VerifiedUser,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { apiGenerateLicense, apiInspectLicense } from "@api/licenseApi";
import type {
  IGenerateLicenseRequest,
  IInspectLicenseRequest,
  IInspectLicenseResponse,
} from "@appTypes/ILicense";
import VerifyLicenseDialog from "../VerifyLicenseDialog";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import PageHeader from "@components/common/PageHeader";
import SectionCard from "@components/common/SectionCard";
import { formatDate } from "@core/helper/format";

const licenseTypes = ["temporal", "permanent"];

export default function AppCredentials() {
  const { app, refresh } = useCurrentApp();

  const [days, setDays] = useState(30);
  const [selectedType, setSelectedType] = useState(licenseTypes[0]);
  const [genLicense, setGenLicense] = useState(app?.generated_license ?? "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expiry, setExpiry] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  useEffect(() => {
    if (app?.generated_license) setGenLicense(app.generated_license);
  }, [app?.generated_license]);

  useEffect(() => {
    if (genLicense) inspectLicense();
  }, [genLicense]);

  const inspectLicense = async () => {
    try {
      const payload: IInspectLicenseRequest = { license: genLicense };
      const res: IApiRes<IInspectLicenseResponse> = await apiInspectLicense(payload);
      setExpiry(res?.data?.expiry ?? "");
    } catch {
      setExpiry("");
    }
  };

  const isExpired = Boolean(expiry) && Date.now() > new Date(expiry).getTime();

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`${label} copied to clipboard`, { variant: "success", autoHideDuration: 2000 });
  };

  const handleGenerateLicense = async () => {
    if (!app?.app_code) {
      return enqueueSnackbar("App Code is required", { variant: "warning" });
    }
    setIsGenerating(true);
    try {
      const payload: IGenerateLicenseRequest = {
        app_code: app.app_code,
        valid_days: days,
        is_permanent: selectedType === licenseTypes[1],
      };
      const res = await apiGenerateLicense(payload);
      if (res.status === "success") {
        setGenLicense(res.data.license);
        enqueueSnackbar("License Generated", { variant: "success" });
      } else {
        handleApiError(res, enqueueSnackbar);
      }
    } catch {
      enqueueSnackbar("Failed to generate license", { variant: "error" });
    } finally {
      setIsGenerating(false);
    }
  };

  const apiKey = app?.api_key ?? "";
  const maskedKey = apiKey ? `${apiKey.slice(0, 6)}${"•".repeat(24)}${apiKey.slice(-4)}` : "No key generated";

  return (
    <Box>
      <PageHeader
        title="Credentials & License"
        subtitle="API key used by this app's clients, and the signed license it validates against."
      />

      <Stack spacing={3}>
        <SectionCard
          title="API key"
          subtitle="Authenticates requests from this app's clients. Keep it secret."
          icon={<VpnKey />}>
          <TextField
            fullWidth
            label="API Key"
            value={showKey ? apiKey || "No key generated" : maskedKey}
            slotProps={{
              input: {
                readOnly: true,
                sx: { fontFamily: "monospace" },
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={showKey ? "Hide" : "Reveal"}>
                      <IconButton onClick={() => setShowKey((s) => !s)} disabled={!apiKey}>
                        {showKey ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy">
                      <IconButton onClick={() => copyToClipboard(apiKey, "API Key")} disabled={!apiKey}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ bgcolor: "action.hover" }}
          />
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 2, textTransform: "none" }}
            startIcon={<Refresh />}
            onClick={() => enqueueSnackbar("Key rotation API is not available yet", { variant: "info" })}>
            Rotate API key
          </Button>
        </SectionCard>

        <SectionCard
          title="License generator"
          subtitle="Generates a signed Ed25519 license string for this app."
          icon={<VerifiedUser />}
          actions={
            genLicense && expiry ? (
              <Chip
                size="small"
                color={isExpired ? "error" : "success"}
                label={isExpired ? "Expired" : `Valid until ${formatDate(expiry)}`}
                sx={{ fontWeight: 700 }}
              />
            ) : undefined
          }>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="App Code"
              value={app?.app_code ?? ""}
              slotProps={{ input: { readOnly: true } }}
              sx={{ width: { xs: "100%", md: "30%" } }}
            />
            <FormControl sx={{ width: { xs: "100%", md: "25%" } }}>
              <InputLabel id="license-type-label">License Type</InputLabel>
              <Select
                labelId="license-type-label"
                value={selectedType}
                label="License Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ textTransform: "capitalize" }}>
                {licenseTypes.map((type) => (
                  <MenuItem key={type} value={type} sx={{ textTransform: "capitalize" }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Validity (Days)"
              type="number"
              disabled={selectedType === "permanent"}
              value={selectedType === "permanent" ? "" : days}
              onChange={(e) => setDays(Number(e.target.value))}
              sx={{ width: { xs: "100%", md: "20%" } }}
            />
            <Button
              variant="contained"
              disableElevation
              onClick={handleGenerateLicense}
              loading={isGenerating}
              sx={{ px: 4, height: { md: "56px" }, width: { xs: "100%", md: "auto" }, flexGrow: { md: 1 } }}>
              {genLicense ? "Regenerate" : "Generate"}
            </Button>
          </Stack>

          {genLicense && (
            <>
              <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: "action.hover", position: "relative", borderRadius: 2 }}>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1, fontWeight: 700 }}>
                  GENERATED LICENSE STRING
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ wordBreak: "break-all", fontFamily: "monospace", color: "success.main", pr: 5 }}>
                  {genLicense}
                </Typography>
                <IconButton
                  onClick={() => copyToClipboard(genLicense, "License")}
                  sx={{ position: "absolute", top: 8, right: 8 }}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Paper>

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  disableElevation
                  sx={{ textTransform: "none", borderRadius: 5 }}
                  onClick={() => setOpenVerify(true)}>
                  Apply license
                </Button>
                {expiry && (
                  <Typography variant="body2" color={isExpired ? "error" : "text.secondary"}>
                    Expiry: {formatDate(expiry, true)}
                  </Typography>
                )}
              </Stack>
            </>
          )}
        </SectionCard>
      </Stack>

      {openVerify && app && (
        <VerifyLicenseDialog
          open={openVerify}
          app={app}
          onClose={() => setOpenVerify(false)}
          onSuccess={() => {
            refresh();
            setOpenVerify(false);
          }}
        />
      )}
    </Box>
  );
}
