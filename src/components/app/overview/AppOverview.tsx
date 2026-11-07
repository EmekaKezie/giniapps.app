import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  ContentCopy,
  PeopleAltOutlined,
  AdminPanelSettingsOutlined,
  MarkEmailReadOutlined,
  HistoryOutlined,
  ArrowForward,
} from "@mui/icons-material";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import { apiGetAppUsers } from "@api/appUserApi";
import { apiGetRoles } from "@api/roleApi";
import { apiGetSmtps } from "@api/smtpApi";
import { apiGetAuditLogs } from "@api/auditLogApi";
import type { IAuditLog } from "@appTypes/IAuditLog";
import { formatDate, timeAgo } from "@core/helper/format";
import AppAvatar from "@components/common/AppAvatar";
import SectionCard from "@components/common/SectionCard";

interface IStats {
  users: number;
  roles: number;
  smtps: number;
  emails30d: number;
  events: number;
  logs: IAuditLog[];
}

function StatCard({ label, value, icon, to }: { label: string; value: ReactNode; icon: ReactNode; to: string }) {
  const navigate = useNavigate();
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardActionArea onClick={() => navigate(to)} sx={{ p: 2.5, height: "100%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ p: 1, borderRadius: 2, display: "flex", color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.08) }}>
            {icon}
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export default function AppOverview() {
  const { app, app_id } = useCurrentApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<IStats | null>(null);

  useEffect(() => {
    setStats(null);
    Promise.all([apiGetAppUsers(app_id), apiGetRoles(app_id), apiGetSmtps(app_id), apiGetAuditLogs(app_id)]).then(
      ([u, r, s, l]) =>
        setStats({
          users: u.data?.length ?? 0,
          roles: r.data?.length ?? 0,
          // "configured" = the app has an active default, i.e. it can send
          smtps: (s.data ?? []).filter((x) => x.is_default && x.is_active).length,
          emails30d: (s.data ?? []).reduce((n, x) => n + x.sent_last_30d, 0),
          events: l.data?.length ?? 0,
          logs: (l.data ?? []).slice(0, 6),
        }),
    );
  }, [app_id]);

  if (!app) return null;

  const base = `/apps/${app_id}`;
  const urls = app.authorized_urls?.split(",").filter(Boolean) ?? [];

  const checklist = [
    { done: Boolean(app.api_key), label: "API key generated", to: `${base}/credentials` },
    { done: Boolean(app.generated_license), label: "License generated", to: `${base}/credentials` },
    { done: urls.length > 0, label: "Authorized URL added", to: `${base}/settings` },
    { done: (stats?.smtps ?? 0) > 0, label: "Default SMTP set (app can send email)", to: `${base}/smtp` },
    { done: (stats?.users ?? 0) > 1, label: "Team members invited", to: `${base}/users` },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar(`${label} copied`, { variant: "success", autoHideDuration: 1500 });
  };

  const stat = (v?: number) => (stats ? (v ?? 0).toLocaleString() : <Skeleton width={48} />);

  return (
    <Box>
      {/* Hero */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} alignItems={{ sm: "center" }} sx={{ mb: 4 }}>
        <AppAvatar name={app.app_name} logo={app.app_logo} size={64} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: "-0.02em" }} noWrap>
            {app.app_name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75, flexWrap: "wrap", rowGap: 1 }}>
            <Chip size="small" label={app.app_code} sx={{ fontFamily: "monospace", fontWeight: 600 }} />
            <Chip
              size="small"
              label={app.is_live === 1 ? "Live" : "Staging"}
              color={app.is_live === 1 ? "success" : "default"}
              variant={app.is_live === 1 ? "filled" : "outlined"}
              sx={{ fontWeight: 700 }}
            />
            <Chip
              size="small"
              label={app.is_active === 1 ? "Active" : "Inactive"}
              color={app.is_active === 1 ? "success" : "warning"}
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
          </Stack>
        </Box>
      </Stack>

      {/* Stats (sample data until the APIs land) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Users" value={stat(stats?.users)} icon={<PeopleAltOutlined />} to={`${base}/users`} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Roles" value={stat(stats?.roles)} icon={<AdminPanelSettingsOutlined />} to={`${base}/roles`} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Emails (30d)" value={stat(stats?.emails30d)} icon={<MarkEmailReadOutlined />} to={`${base}/smtp`} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Events logged" value={stat(stats?.events)} icon={<HistoryOutlined />} to={`${base}/audit-logs`} />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={2.5}>
            {/* Setup checklist */}
            <SectionCard
              title="Setup checklist"
              subtitle={`${doneCount} of ${checklist.length} complete`}
              noPadding>
              <Divider />
              {checklist.map((c, i) => (
                <Box key={c.label}>
                  {i > 0 && <Divider />}
                  <CardActionArea onClick={() => navigate(c.to)} sx={{ px: 3, py: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {c.done ? <CheckCircle color="success" fontSize="small" /> : <RadioButtonUnchecked fontSize="small" sx={{ color: "text.disabled" }} />}
                      <Typography
                        variant="body2"
                        fontWeight={c.done ? 500 : 700}
                        color={c.done ? "text.secondary" : "text.primary"}
                        sx={{ flexGrow: 1 }}>
                        {c.label}
                      </Typography>
                      {!c.done && <ArrowForward fontSize="small" sx={{ color: "primary.main" }} />}
                    </Stack>
                  </CardActionArea>
                </Box>
              ))}
            </SectionCard>

            {/* Recent activity */}
            <SectionCard
              title="Recent activity"
              noPadding
              actions={
                <Button size="small" onClick={() => navigate(`${base}/audit-logs`)} sx={{ textTransform: "none" }}>
                  View all
                </Button>
              }>
              <Divider />
              {!stats &&
                [1, 2, 3].map((i) => (
                  <Box key={i} sx={{ px: 3, py: 1.5 }}>
                    <Skeleton />
                  </Box>
                ))}
              {stats?.logs.map((l, i) => (
                <Box key={l.log_id}>
                  {i > 0 && <Divider />}
                  <Stack direction="row" spacing={2} sx={{ px: 3, py: 1.5 }} alignItems="center">
                    <Typography variant="body2" sx={{ flexGrow: 1, minWidth: 0 }} noWrap>
                      <b>{l.actor_name}</b> {l.action.toLowerCase()}
                      {l.target && (
                        <Box component="span" sx={{ color: "text.secondary" }}>
                          {" "}
                          · {l.target}
                        </Box>
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                      {timeAgo(l.created_date)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </SectionCard>
          </Stack>
        </Grid>

        {/* App details (real data) */}
        <Grid size={{ xs: 12, md: 5 }}>
          <SectionCard title="App details">
            <Stack spacing={2}>
              {[
                { label: "App ID", value: app.app_id, copy: true },
                { label: "App code", value: app.app_code, copy: true },
                { label: "Environment", value: app.is_live === 1 ? "Production" : "Staging" },
                { label: "Created", value: formatDate(app.created_date) },
              ].map((row) => (
                <Box key={row.label}>
                  <Typography variant="caption" color="text.secondary">
                    {row.label}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      noWrap
                      sx={{ fontFamily: row.copy ? "monospace" : undefined, minWidth: 0 }}>
                      {row.value || "—"}
                    </Typography>
                    {row.copy && row.value && (
                      <Tooltip title="Copy">
                        <IconButton size="small" onClick={() => copy(row.value!, row.label)}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Box>
              ))}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Authorized URLs
                </Typography>
                {urls.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    None yet
                  </Typography>
                ) : (
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {urls.map((u) => (
                      <Typography key={u} variant="body2" sx={{ fontFamily: "monospace", wordBreak: "break-all" }}>
                        {u}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
