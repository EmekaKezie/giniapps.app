import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  AddLinkOutlined,
  DnsOutlined,
  MoreVert,
  SendOutlined,
  EditOutlined,
  StarOutline,
  Star,
  DeleteOutline,
  CheckCircle,
  ErrorOutline,
  HelpOutline,
  BlockOutlined,
  PlayCircleOutline,
  PublicOutlined,
} from "@mui/icons-material";
import { useEffect, useState, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { enqueueSnackbar } from "notistack";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import type { IApiRes } from "@appTypes/IAap";
import type { IAppSmtp } from "@appTypes/ISmtp";
import {
  apiGetSmtps,
  apiRemoveSmtp,
  apiSetDefaultSmtp,
  apiSetSmtpStatus,
  apiVerifySmtp,
} from "@api/smtpApi";
import { handleApiError } from "@core/helper/apiErrorHandler";
import { formatDate, timeAgo } from "@core/helper/format";
import PageHeader from "@components/common/PageHeader";
import ConfirmDialog from "@components/common/ConfirmDialog";
import SmtpFormDrawer from "./SmtpFormDrawer";
import AssignSmtpDialog from "./AssignSmtpDialog";
import TestSmtpDialog from "./TestSmtpDialog";
import { securityLabel, smtpHealth } from "./smtpOptions";

const HEALTH_ICON: Record<string, ReactElement> = {
  Verified: <CheckCircle />,
  Failing: <ErrorOutline />,
  "Not tested": <HelpOutline />,
};

function Detail({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} noWrap sx={mono ? { fontFamily: "monospace", fontSize: "0.8rem" } : undefined}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function AppSmtp() {
  const { app_id, app } = useCurrentApp();
  const appName = app?.app_name;

  const [smtps, setSmtps] = useState<IAppSmtp[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [menu, setMenu] = useState<{ el: HTMLElement; smtp: IAppSmtp } | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IAppSmtp | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [testing, setTesting] = useState<IAppSmtp | null>(null);
  const [removing, setRemoving] = useState<IAppSmtp | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (quiet = false) => {
    if (!quiet) setLoading(true);
    const res = await apiGetSmtps(app_id);
    if (res.status === "success") {
      setSmtps(res.data ?? []);
      setFailed(false);
    } else {
      setFailed(true);
      handleApiError(res, enqueueSnackbar);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [app_id]);

  const hasDefault = smtps.some((s) => s.is_default && s.is_active);

  /** Runs an action, shows its message, refreshes the list. */
  const act = async <T,>(smtp: IAppSmtp, fn: () => Promise<IApiRes<T>>, success?: string) => {
    setMenu(null);
    setBusyId(smtp.smtp_id);
    const res = await fn();
    setBusyId(null);
    if (res.status === "success") enqueueSnackbar(success ?? res.message, { variant: "success" });
    else handleApiError(res, enqueueSnackbar);
    await load(true);
    return res;
  };

  /** Quiet connection test after create/edit/assign. */
  const autoTest = async (smtp_id: string, name?: string) => {
    setBusyId(smtp_id);
    const res = await apiVerifySmtp(app_id, smtp_id);
    setBusyId(null);
    if (res.status === "success" && res.data) {
      enqueueSnackbar(
        res.data.verified ? `${name ?? "SMTP"}: connection works` : `${name ?? "SMTP"}: connection failed. ${res.data.error ?? ""}`,
        { variant: res.data.verified ? "success" : "error" },
      );
    }
    load(true);
  };

  const remove = async () => {
    if (!removing) return;
    const target = removing;
    const res = await act(target, () => apiRemoveSmtp(app_id, target.smtp_id));
    setRemoving(null);
    if (res.status === "success" && res.data && !res.data.app_has_default) {
      enqueueSnackbar(`${appName ?? "This app"} has no SMTP now and can't send email`, { variant: "warning" });
    }
  };

  const removeMessage = (s: IAppSmtp) => {
    const parts: string[] = [];
    if (s.is_system_defined || s.app_count > 1) {
      parts.push(`${appName ?? "This app"} will stop using "${s.smtp_name}". Other apps keep it.`);
    } else {
      parts.push(`"${s.smtp_name}" isn't used by any other app, so it will be deleted. Sent emails keep their history.`);
    }
    if (s.is_default) {
      const next = smtps.find((x) => x.smtp_id !== s.smtp_id && x.is_active);
      parts.push(
        next
          ? `"${next.smtp_name}" will become the default.`
          : `It's the only SMTP, so ${appName ?? "the app"} won't be able to send email until you add another.`,
      );
    }
    return parts.join(" ");
  };

  return (
    <Box>
      <PageHeader
        title="SMTP"
        subtitle={`Mail servers ${appName ?? "this app"} can send through. Emails always go out through the default.`}
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<AddLinkOutlined />}
              onClick={() => setAssignOpen(true)}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
              Assign existing
            </Button>
            <Button
              variant="contained"
              disableElevation
              startIcon={<Add />}
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              disabled={loading}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
              Add SMTP
            </Button>
          </>
        }
      />

      {!loading && !failed && !hasDefault && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <b>{appName ?? "This app"} can't send email.</b>{" "}
          {smtps.length ? "None of its SMTPs is an active default. Make one the default." : "Add an SMTP or assign an existing one to start sending."}
        </Alert>
      )}

      <Grid container spacing={2}>
        {loading &&
          [1, 2].map((i) => (
            <Grid key={i} size={{ xs: 12, lg: 6 }}>
              <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Skeleton width="40%" height={28} />
                <Skeleton width="70%" />
                <Skeleton height={80} />
              </Card>
            </Grid>
          ))}

        {!loading &&
          smtps.map((s) => {
            const health = smtpHealth(s);
            const busy = busyId === s.smtp_id;
            return (
              <Grid key={s.smtp_id} size={{ xs: 12, lg: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    borderColor: s.is_default ? "primary.main" : "divider",
                    opacity: s.is_active ? 1 : 0.7,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ p: 2.5, pb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: "action.hover", display: "flex", color: "primary.main" }}>
                      <DnsOutlined />
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
                        <Typography fontWeight={800} noWrap>
                          {s.smtp_name}
                        </Typography>
                        {s.is_default && <Chip size="small" icon={<Star />} label="Default" color="primary" sx={{ height: 22, fontWeight: 700 }} />}
                        {s.is_system_defined && (
                          <Tooltip title="Shared platform SMTP. It can be assigned to any app but not edited here.">
                            <Chip size="small" icon={<PublicOutlined />} label="System" sx={{ height: 22, fontWeight: 700 }} />
                          </Tooltip>
                        )}
                        {!s.is_active && <Chip size="small" label="Disabled" variant="outlined" sx={{ height: 22, fontWeight: 700 }} />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ fontFamily: "monospace" }}>
                        {s.host}:{s.port}
                      </Typography>
                    </Box>
                    <Tooltip
                      title={
                        s.verification_error
                          ? s.verification_error
                          : s.last_verified_date
                            ? `Last tested ${formatDate(s.last_verified_date, true)}`
                            : "Run a test to check this SMTP"
                      }>
                      <Chip size="small" variant="outlined" color={health.color} icon={HEALTH_ICON[health.label]} label={health.label} sx={{ fontWeight: 700 }} />
                    </Tooltip>
                    <IconButton size="small" disabled={busy} onClick={(e: MouseEvent<HTMLElement>) => setMenu({ el: e.currentTarget, smtp: s })}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Stack>

                  {s.verification_error && (
                    <Alert severity="error" sx={{ mx: 2.5, mb: 2, py: 0, borderRadius: 2, wordBreak: "break-word" }}>
                      {s.verification_error}
                    </Alert>
                  )}

                  <Divider />
                  <Grid container spacing={2} sx={{ p: 2.5, flexGrow: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Detail label="From" value={s.sender_name ? `${s.sender_name} <${s.sender_email}>` : s.sender_email} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Detail label="Security" value={securityLabel(s.security)} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Detail label="Provider" value={<Box component="span" sx={{ textTransform: "capitalize" }}>{s.provider_name}</Box>} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Detail label="Username" value={s.username} mono />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Detail label="Sent (30d)" value={s.sent_last_30d.toLocaleString()} />
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Detail label="Used by" value={`${s.app_count} app${s.app_count === 1 ? "" : "s"}`} />
                    </Grid>
                    {s.reply_to_email && (
                      <Grid size={12}>
                        <Detail label="Reply-to" value={s.reply_to_email} />
                      </Grid>
                    )}
                  </Grid>
                  <Divider />
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2.5, py: 1.5 }}>
                    <Button size="small" startIcon={<SendOutlined />} disabled={busy} onClick={() => setTesting(s)} sx={{ textTransform: "none" }}>
                      Test
                    </Button>
                    <Tooltip title={s.is_system_defined ? "System SMTPs are shared and can't be edited here" : ""}>
                      <span>
                        <Button
                          size="small"
                          color="inherit"
                          startIcon={<EditOutlined />}
                          disabled={busy || s.is_system_defined}
                          onClick={() => {
                            setEditing(s);
                            setFormOpen(true);
                          }}
                          sx={{ textTransform: "none" }}>
                          Edit
                        </Button>
                      </span>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      {busy ? "Working…" : `Added ${timeAgo(s.assigned_date)}`}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      {!loading && !failed && smtps.length === 0 && (
        <Card variant="outlined" sx={{ borderRadius: 3, borderStyle: "dashed" }}>
          <Stack alignItems="center" spacing={1.5} sx={{ py: 8, textAlign: "center", px: 2 }}>
            <DnsOutlined sx={{ fontSize: 44, color: "text.disabled" }} />
            <Typography fontWeight={700}>No SMTP yet</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
              Use a shared SMTP that's already set up, or add {appName ?? "this app"}'s own mail server.
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<AddLinkOutlined />} onClick={() => setAssignOpen(true)}>
                Assign existing
              </Button>
              <Button
                variant="contained"
                disableElevation
                startIcon={<Add />}
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}>
                Add SMTP
              </Button>
            </Stack>
          </Stack>
        </Card>
      )}

      {!loading && failed && (
        <Stack alignItems="center" spacing={1.5} sx={{ py: 8 }}>
          <Typography color="text.secondary">Couldn't load SMTPs.</Typography>
          <Button variant="outlined" onClick={() => load()}>
            Try again
          </Button>
        </Stack>
      )}

      {/* Card menu */}
      <Menu
        anchorEl={menu?.el}
        open={Boolean(menu)}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 200 } } }}>
        {menu && !menu.smtp.is_default && (
          <MenuItem onClick={() => act(menu.smtp, () => apiSetDefaultSmtp(app_id, menu.smtp.smtp_id), `${menu.smtp.smtp_name} is now the default`)}>
            <ListItemIcon>
              <StarOutline fontSize="small" />
            </ListItemIcon>
            Make default
          </MenuItem>
        )}
        {menu && menu.smtp.is_active && (
          <Tooltip title={menu.smtp.is_default ? "Make another SMTP the default first" : ""} placement="left">
            <span>
              <MenuItem
                disabled={menu.smtp.is_default}
                onClick={() => act(menu.smtp, () => apiSetSmtpStatus(app_id, menu.smtp.smtp_id, false))}>
                <ListItemIcon>
                  <BlockOutlined fontSize="small" />
                </ListItemIcon>
                Disable for this app
              </MenuItem>
            </span>
          </Tooltip>
        )}
        {menu && !menu.smtp.is_active && (
          <MenuItem onClick={() => act(menu.smtp, () => apiSetSmtpStatus(app_id, menu.smtp.smtp_id, true))}>
            <ListItemIcon>
              <PlayCircleOutline fontSize="small" />
            </ListItemIcon>
            Enable for this app
          </MenuItem>
        )}
        <Divider />
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            setRemoving(menu!.smtp);
            setMenu(null);
          }}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          {menu && !menu.smtp.is_system_defined && menu.smtp.app_count <= 1 ? "Delete" : "Remove from app"}
        </MenuItem>
      </Menu>

      <SmtpFormDrawer
        open={formOpen}
        app_id={app_id}
        appName={appName}
        smtp={editing}
        appHasDefault={hasDefault}
        onClose={() => setFormOpen(false)}
        onSuccess={(smtp_id, testAfterSave) => {
          const name = editing?.smtp_name;
          setFormOpen(false);
          enqueueSnackbar(editing ? "SMTP updated" : "SMTP added", { variant: "success" });
          if (testAfterSave) autoTest(smtp_id, name);
          else load(true);
        }}
      />

      <AssignSmtpDialog
        open={assignOpen}
        app_id={app_id}
        appName={appName}
        appHasDefault={hasDefault}
        onClose={() => setAssignOpen(false)}
        onSuccess={(_, becameDefault) => {
          setAssignOpen(false);
          enqueueSnackbar(becameDefault ? "SMTP assigned and set as default" : "SMTP assigned", { variant: "success" });
          load(true);
        }}
      />

      {testing && (
        <TestSmtpDialog open app_id={app_id} smtp={testing} onClose={() => setTesting(null)} onDone={() => load(true)} />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        title={removing && !removing.is_system_defined && removing.app_count <= 1 ? "Delete SMTP?" : "Remove SMTP from app?"}
        message={removing ? removeMessage(removing) : ""}
        confirmLabel={removing && !removing.is_system_defined && removing.app_count <= 1 ? "Delete" : "Remove"}
        destructive
        loading={Boolean(removing && busyId === removing.smtp_id)}
        onConfirm={remove}
        onClose={() => setRemoving(null)}
      />
    </Box>
  );
}
