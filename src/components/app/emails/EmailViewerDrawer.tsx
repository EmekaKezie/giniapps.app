import {
  Alert,
  Box,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Close,
  ContentCopy,
  DesktopWindowsOutlined,
  PhoneIphoneOutlined,
  WrapTextOutlined,
} from "@mui/icons-material";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { enqueueSnackbar } from "notistack";
import type { IEmailOutbox } from "@appTypes/IEmailOutbox";
import { formatDate } from "@core/helper/format";
import { buildPreviewDoc, emailStatus } from "./emailStatus";

type TProps = {
  email: IEmailOutbox | null;
  onClose: () => void;
};

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 72, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ minWidth: 0, wordBreak: "break-word" }} component="div">
        {children}
      </Typography>
    </Stack>
  );
}

export default function EmailViewerDrawer({ email, onClose }: TProps) {
  const [tab, setTab] = useState<"preview" | "html">("preview");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [wrap, setWrap] = useState(true);

  // start every newly opened email on the preview
  useEffect(() => {
    if (email) setTab("preview");
  }, [email?.message_id]);

  const body = email?.message_body ?? "";
  const previewDoc = useMemo(() => (body ? buildPreviewDoc(body) : ""), [body]);
  const status = emailStatus(email?.status);
  const error = email?.error_message || email?.delivery_report?.error_message;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`${label} copied`, { variant: "success", autoHideDuration: 1500 });
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(email)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: { xs: "100%", md: 760, lg: 880 }, display: "flex", flexDirection: "column" },
        },
      }}>
      {email && (
        <>
          {/* Header */}
          <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ px: 3, pt: 2.5, pb: 2 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.3, wordBreak: "break-word" }}>
                {email.subject || "(no subject)"}
              </Typography>
              <Chip
                size="small"
                label={status.label}
                color={status.color}
                variant="outlined"
                sx={{ mt: 1, fontWeight: 700 }}
              />
            </Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>

          <Stack spacing={0.75} sx={{ px: 3, pb: 2 }}>
            <Meta label="To">{email.recipient}</Meta>
            <Meta label="From">{email.sender || "—"}</Meta>
            <Meta label="SMTP">
              {email.smtp ? (
                <>
                  {email.smtp.smtp_name}{" "}
                  <Box component="span" sx={{ color: "text.secondary", fontFamily: "monospace", fontSize: "0.8rem" }}>
                    ({email.smtp.host})
                  </Box>
                </>
              ) : (
                "—"
              )}
            </Meta>
            <Meta label="Queued">{formatDate(email.created_date, true, true)}</Meta>
            <Meta label="Sent">{email.sent_date ? formatDate(email.sent_date, true, true) : "Not sent yet"}</Meta>
            {email.delivery_report && (
              <Meta label="Report">
                {emailStatus(email.delivery_report.status).label} · {formatDate(email.delivery_report.reported_date, true)}
              </Meta>
            )}
            <Meta label="ID">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box component="span" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                  {email.message_id}
                </Box>
                <IconButton size="small" onClick={() => copy(email.message_id, "Message ID")}>
                  <ContentCopy sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
            </Meta>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mx: 3, mb: 2, borderRadius: 2, wordBreak: "break-word" }}>
              {error}
            </Alert>
          )}

          {/* Tabs + view options */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 3, borderBottom: 1, borderTop: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 44, "& .MuiTab-root": { minHeight: 44 } }}>
              <Tab value="preview" label="Preview" sx={{ textTransform: "none", fontWeight: 700 }} />
              <Tab value="html" label="HTML" sx={{ textTransform: "none", fontWeight: 700 }} />
            </Tabs>
            {tab === "preview" ? (
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
            ) : (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title={wrap ? "Don't wrap lines" : "Wrap lines"}>
                  <IconButton size="small" color={wrap ? "primary" : "default"} onClick={() => setWrap((w) => !w)}>
                    <WrapTextOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy HTML">
                  <span>
                    <IconButton size="small" disabled={!body} onClick={() => copy(body, "HTML")}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
          </Stack>

          {/* Body */}
          <Box sx={{ flexGrow: 1, minHeight: 0, bgcolor: "background.default", display: "flex" }}>
            {!body ? (
              <Stack alignItems="center" justifyContent="center" sx={{ flexGrow: 1, color: "text.secondary", p: 4 }}>
                <Typography variant="body2">This email has no stored body.</Typography>
              </Stack>
            ) : tab === "preview" ? (
              <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", p: device === "mobile" ? 2 : 0 }}>
                {/*
                  Sandboxed: no scripts, no same-origin access, so stored HTML can't touch the console.
                  Popups are allowed only so links in the email open in a new tab.
                */}
                <Box
                  component="iframe"
                  key={email.message_id}
                  title="Email preview"
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
            ) : (
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 3,
                  flexGrow: 1,
                  overflow: "auto",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                  fontSize: "0.8rem",
                  lineHeight: 1.6,
                  whiteSpace: wrap ? "pre-wrap" : "pre",
                  wordBreak: wrap ? "break-all" : "normal",
                  color: "text.primary",
                  bgcolor: "background.paper",
                }}>
                {body}
              </Box>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}
