import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { ChevronRight, MailOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import type { IEmailTemplate } from "@appTypes/IEmailTemplate";
import type { IAppSmtp } from "@appTypes/ISmtp";
import { apiGetEmailTemplates } from "@api/emailTemplateApi";
import { apiGetSmtps } from "@api/smtpApi";
import { timeAgo } from "@core/helper/format";
import PageHeader from "@components/common/PageHeader";
import MockBanner from "@components/common/MockBanner";
import EditTemplateDrawer from "./EditTemplateDrawer";

export default function AppEmailTemplates() {
  const { app_id, app } = useCurrentApp();

  const [templates, setTemplates] = useState<IEmailTemplate[]>([]);
  const [smtps, setSmtps] = useState<IAppSmtp[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IEmailTemplate | null>(null);

  const load = async () => {
    const [t, s] = await Promise.all([apiGetEmailTemplates(app_id), apiGetSmtps(app_id)]);
    setTemplates(t.data ?? []);
    setSmtps(s.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [app_id]);

  const smtpLabel = (id?: string | null) =>
    id ? (smtps.find((s) => s.smtp_id === id)?.smtp_name ?? "Unknown SMTP") : "Default SMTP";

  return (
    <Box>
      <PageHeader
        title="Email Templates"
        subtitle={`The emails ${app?.app_name ?? "this app"} sends. Your code refers to each template by its key.`}
      />
      <MockBanner feature="Email templates" />

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        {loading &&
          [1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ px: 3, py: 2 }}>
              <Skeleton width="30%" />
              <Skeleton width="60%" />
            </Box>
          ))}
        {!loading &&
          templates.map((t, i) => (
            <Box key={t.template_id}>
              {i > 0 && <Divider />}
              <CardActionArea onClick={() => setEditing(t)} sx={{ px: 3, py: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: "action.hover", display: "flex", color: t.is_active ? "primary.main" : "text.disabled" }}>
                    <MailOutline fontSize="small" />
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                        {t.key}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {t.subject}
                    </Typography>
                  </Box>
                  <Stack alignItems="flex-end" spacing={0.5} sx={{ display: { xs: "none", sm: "flex" }, flexShrink: 0 }}>
                    <Chip
                      size="small"
                      label={t.is_active ? "Enabled" : "Disabled"}
                      color={t.is_active ? "success" : "default"}
                      variant="outlined"
                      sx={{ height: 22, fontWeight: 700 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {smtpLabel(t.smtp_id)} · edited {timeAgo(t.updated_date)}
                    </Typography>
                  </Stack>
                  <ChevronRight sx={{ color: "text.disabled" }} />
                </Stack>
              </CardActionArea>
            </Box>
          ))}
      </Card>

      <EditTemplateDrawer
        app_id={app_id}
        appName={app?.app_name}
        template={editing}
        smtps={smtps}
        onClose={() => setEditing(null)}
        onSuccess={() => {
          setEditing(null);
          load();
        }}
      />
    </Box>
  );
}
