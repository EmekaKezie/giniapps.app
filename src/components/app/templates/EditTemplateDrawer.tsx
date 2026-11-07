import {
  Box,
  Button,
  Chip,
  Drawer,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { Close, DesktopWindowsOutlined, PhoneIphoneOutlined } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import type { IEmailTemplate } from "@appTypes/IEmailTemplate";
import type { IAppSmtp } from "@appTypes/ISmtp";
import { apiUpdateEmailTemplate } from "@api/emailTemplateApi";
import RichtextEditor from "@core/common/RichtextEditor";
import { timeAgo } from "@core/helper/format";
import { buildPreviewDoc } from "../emails/emailStatus";

type TProps = {
  /** null = closed */
  template: IEmailTemplate | null;
  app_id: string;
  appName?: string;
  smtps: IAppSmtp[];
  onClose: () => void;
  onSuccess: () => void;
};

// Fills {{variables}} with sample values for the preview tab.
const fillSample = (text: string, appName: string) =>
  text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, v: string) => {
    const samples: Record<string, string> = {
      app_name: appName,
      firstname: "Ada",
      otp_code: "482913",
      expires_in: "10 minutes",
      days_left: "7",
      inviter_name: "Emeka",
      role_name: "Support",
    };
    return samples[v] ?? `[${v}]`;
  });

export default function EditTemplateDrawer({ template, app_id, appName = "Your app", smtps, onClose, onSuccess }: TProps) {
  // Keep showing the last template while the drawer slides closed.
  const [shown, setShown] = useState<IEmailTemplate | null>(template);
  useEffect(() => {
    if (template) setShown(template);
  }, [template]);

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [smtpId, setSmtpId] = useState("");
  const [active, setActive] = useState(true);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);

  // Reset the form every time the drawer opens (template goes null -> value),
  // so discarded edits never come back.
  useEffect(() => {
    if (!template) return;
    setSubject(template.subject);
    setBody(template.body_html);
    setSmtpId(template.smtp_id ?? "");
    setActive(template.is_active);
    setTab("edit");
  }, [template]);

  const dirty =
    Boolean(shown) &&
    (subject !== shown!.subject ||
      body !== shown!.body_html ||
      smtpId !== (shown!.smtp_id ?? "") ||
      active !== shown!.is_active);

  const requestClose = () => {
    if (saving) return;
    if (dirty && !window.confirm("Discard your unsaved changes to this template?")) return;
    onClose();
  };

  const previewDoc = useMemo(
    () => (tab === "preview" ? buildPreviewDoc(fillSample(body, appName)) : ""),
    [tab, body, appName],
  );

  const save = async () => {
    if (!shown) return;
    setSaving(true);
    await apiUpdateEmailTemplate(app_id, shown.template_id, {
      subject,
      body_html: body,
      smtp_id: smtpId || null,
      is_active: active,
    });
    setSaving(false);
    enqueueSnackbar(`"${shown.name}" saved`, { variant: "success" });
    onSuccess();
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(template)}
      onClose={requestClose}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", md: 760, lg: 880 }, display: "flex", flexDirection: "column" },
        },
      }}>
      {shown && (
        <>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ px: 3, pt: 2.5, pb: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.3 }}>
                {shown.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, flexWrap: "wrap", rowGap: 0.5 }}>
                <Chip
                  size="small"
                  label={active ? "Enabled" : "Disabled"}
                  color={active ? "success" : "default"}
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                  key: {shown.key}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  · edited {timeAgo(shown.updated_date)}
                </Typography>
              </Stack>
            </Box>
            <IconButton onClick={requestClose}>
              <Close />
            </IconButton>
          </Stack>

          {/* Tabs + view options */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, borderBottom: 1, borderTop: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 44, "& .MuiTab-root": { minHeight: 44 } }}>
              <Tab value="edit" label="Edit" sx={{ textTransform: "none", fontWeight: 700 }} />
              <Tab value="preview" label="Preview" sx={{ textTransform: "none", fontWeight: 700 }} />
            </Tabs>
            {tab === "preview" && (
              <ToggleButtonGroup
                size="small"
                exclusive
                value={device}
                onChange={(_, v) => v && setDevice(v)}
                sx={{ display: { xs: "none", sm: "flex" } }}>
                <ToggleButton value="desktop" aria-label="Desktop width">
                  <Tooltip title="Desktop">
                    <DesktopWindowsOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="mobile" aria-label="Mobile width">
                  <Tooltip title="Mobile">
                    <PhoneIphoneOutlined fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          </Stack>

          {/* Body */}
          {tab === "edit" ? (
            <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto", px: 3, py: 2.5 }}>
              <Stack spacing={2.5}>
                <TextField fullWidth label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.75 }}>
                    Available variables (click to add to subject, or type them in the body)
                  </Typography>
                  <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
                    {shown.variables.map((v) => (
                      <Chip
                        key={v}
                        size="small"
                        label={`{{${v}}}`}
                        onClick={() => setSubject((s) => `${s}{{${v}}}`)}
                        sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}
                      />
                    ))}
                  </Stack>
                </Box>
                <RichtextEditor value={body} onChange={setBody} height={280} placeholder="Write the email body" />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <TextField
                    select
                    size="small"
                    label="Send with"
                    value={smtpId}
                    onChange={(e) => setSmtpId(e.target.value)}
                    sx={{ minWidth: 260 }}>
                    <MenuItem value="">Default SMTP</MenuItem>
                    {smtps
                      .filter((s) => s.is_active || s.smtp_id === smtpId)
                      .map((s) => (
                        <MenuItem key={s.smtp_id} value={s.smtp_id}>
                          {s.smtp_name}
                        </MenuItem>
                      ))}
                  </TextField>
                  <FormControlLabel
                    control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
                    label={<Typography variant="body2" fontWeight={600}>Enabled</Typography>}
                  />
                </Stack>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1, minHeight: 0, display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
              <Box sx={{ px: 3, py: 1.5, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
                <Typography variant="caption" color="text.secondary">
                  Subject · variables filled with sample values
                </Typography>
                <Typography fontWeight={700} sx={{ wordBreak: "break-word" }}>
                  {fillSample(subject, appName) || "(no subject)"}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, minHeight: 0, display: "flex", justifyContent: "center", p: device === "mobile" ? 2 : 0 }}>
                {/* sandboxed: no scripts, no same-origin access to the console */}
                <Box
                  component="iframe"
                  title="Template preview"
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                  referrerPolicy="no-referrer"
                  srcDoc={previewDoc}
                  sx={{
                    border: 0,
                    bgcolor: "#fff",
                    display: "block",
                    width: device === "mobile" ? 390 : "100%",
                    maxWidth: "100%",
                    height: "100%",
                    borderRadius: device === "mobile" ? 3 : 0,
                    boxShadow: device === "mobile" ? 3 : "none",
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Footer */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
            sx={{ px: 3, py: 1.5, borderTop: 1, borderColor: "divider", bgcolor: "background.paper" }}>
            {dirty && (
              <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
                Unsaved changes
              </Typography>
            )}
            <Button
              color="inherit"
              onClick={() => enqueueSnackbar("Test send will be available once the API is ready", { variant: "info" })}>
              Send test
            </Button>
            <Button color="inherit" onClick={requestClose} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" disableElevation loading={saving} disabled={!dirty} onClick={save}>
              Save template
            </Button>
          </Stack>
        </>
      )}
    </Drawer>
  );
}
