import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUpload, Delete, Language, TuneOutlined, WarningAmberOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import PageHeader from "@components/common/PageHeader";
import SectionCard from "@components/common/SectionCard";
import ConfirmDialog from "@components/common/ConfirmDialog";
import AppAvatar from "@components/common/AppAvatar";
import MockBanner from "@components/common/MockBanner";

/**
 * Values are loaded from the real app record. Saving and deleting are mocked
 * until update/delete endpoints exist (see `appApi.ts`).
 */
export default function AppSettings() {
  const { app } = useCurrentApp();

  const initialUrls = app?.authorized_urls?.split(",").filter(Boolean) ?? [];

  const [name, setName] = useState(app?.app_name ?? "");
  const [isActive, setIsActive] = useState(app?.is_active === 1);
  const [isLive, setIsLive] = useState(app?.is_live === 1);
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setName(app?.app_name ?? "");
    setIsActive(app?.is_active === 1);
    setIsLive(app?.is_live === 1);
    setUrls(app?.authorized_urls?.split(",").filter(Boolean) ?? []);
  }, [app]);

  const dirty =
    name !== (app?.app_name ?? "") ||
    isActive !== (app?.is_active === 1) ||
    isLive !== (app?.is_live === 1) ||
    urls.join(",") !== initialUrls.join(",");

  const addUrl = () => {
    const v = urlInput.trim().replace(/\/+$/, "");
    if (!v) return;
    if (!/^https?:\/\/\S+$/.test(v)) {
      enqueueSnackbar("URL must start with http:// or https://", { variant: "warning" });
      return;
    }
    if (!urls.includes(v)) setUrls((u) => [...u, v]);
    setUrlInput("");
  };

  const save = async () => {
    setSaving(true);
    // TODO: call an update-app endpoint once available
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    enqueueSnackbar("Settings saved (preview, not persisted yet)", { variant: "info" });
  };

  const reset = () => {
    setName(app?.app_name ?? "");
    setIsActive(app?.is_active === 1);
    setIsLive(app?.is_live === 1);
    setUrls(initialUrls);
  };

  return (
    <Box>
      <PageHeader title="Settings" subtitle="General configuration for this app." />
      <MockBanner feature="Saving settings" />

      <Stack spacing={3}>
        <SectionCard title="General" icon={<TuneOutlined />}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={2.5}>
                <TextField label="App name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                <TextField
                  label="App code"
                  fullWidth
                  value={app?.app_code ?? ""}
                  slotProps={{ input: { readOnly: true, sx: { fontFamily: "monospace" } } }}
                  helperText="The app code is baked into licenses and can't be changed."
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 4 }}>
                  <FormControlLabel
                    control={<Switch checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
                    label={<Typography variant="body2" fontWeight={700}>Active</Typography>}
                  />
                  <FormControlLabel
                    control={<Switch checked={isLive} onChange={(e) => setIsLive(e.target.checked)} />}
                    label={<Typography variant="body2" fontWeight={700}>Production mode</Typography>}
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                Logo
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <AppAvatar name={name || app?.app_name} logo={app?.app_logo} size={64} />
                <Button component="label" variant="outlined" size="small" startIcon={<CloudUpload />} sx={{ textTransform: "none" }}>
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={() => enqueueSnackbar("Logo upload is not available yet", { variant: "info" })}
                  />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard
          title="Authorized URLs"
          subtitle="Backends allowed to validate this app's license (used by Apply license)."
          icon={<Language />}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="https://api.yourapp.com"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
            />
            <Button variant="outlined" onClick={addUrl} sx={{ fontWeight: 700 }}>
              Add
            </Button>
          </Stack>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {urls.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No URLs yet.
              </Typography>
            )}
            {urls.map((u) => (
              <Chip
                key={u}
                label={u}
                variant="outlined"
                deleteIcon={<Delete />}
                onDelete={() => setUrls((list) => list.filter((x) => x !== u))}
                sx={{ borderRadius: 1.5, fontWeight: 600, fontFamily: "monospace" }}
              />
            ))}
          </Box>
        </SectionCard>

        {dirty && (
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button color="inherit" onClick={reset} disabled={saving}>
              Discard
            </Button>
            <Button variant="contained" disableElevation loading={saving} onClick={save}>
              Save changes
            </Button>
          </Stack>
        )}

        <SectionCard title="Danger zone" icon={<WarningAmberOutlined />} danger>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems={{ sm: "center" }}>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                Delete this app
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Removes the app, its API key and license. Clients using them will stop working.
              </Typography>
            </Box>
            <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)} sx={{ flexShrink: 0, textTransform: "none", fontWeight: 700 }}>
              Delete app
            </Button>
          </Stack>
        </SectionCard>
      </Stack>

      {confirmDelete && (
        <ConfirmDialog
          open
          title={`Delete ${app?.app_name}?`}
          message="This permanently deletes the app and revokes its credentials. This can't be undone."
          confirmText={app?.app_code}
          confirmLabel="Delete app"
          destructive
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => {
            // TODO: call delete-app endpoint once available
            setConfirmDelete(false);
            enqueueSnackbar("Delete app API is not available yet", { variant: "info" });
            // once real: navigate("/apps") after a successful delete
          }}
        />
      )}
    </Box>
  );
}
