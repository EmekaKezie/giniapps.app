import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  Skeleton,
  Stack,
  Switch,
  Typography,
  alpha,
} from "@mui/material";
import { DnsOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import type { IAvailableSmtp } from "@appTypes/ISmtp";
import { apiAssignSmtp, apiGetAvailableSmtps } from "@api/smtpApi";
import { securityLabel, smtpHealth } from "./smtpOptions";

type TProps = {
  open: boolean;
  app_id: string;
  appName?: string;
  appHasDefault: boolean;
  onClose: () => void;
  onSuccess: (smtp_id: string, becameDefault: boolean) => void;
};

export default function AssignSmtpDialog({ open, app_id, appName, appHasDefault, onClose, onSuccess }: TProps) {
  const [smtps, setSmtps] = useState<IAvailableSmtp[] | null>(null);
  const [selected, setSelected] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSmtps(null);
    setSelected("");
    setMakeDefault(false);
    setError("");
    apiGetAvailableSmtps(app_id).then((res) => {
      if (res.status === "success") {
        const list = res.data ?? [];
        setSmtps(list);
        if (list.length === 1) setSelected(list[0].smtp_id);
      } else {
        setSmtps([]);
        setError(res.message || "Could not load SMTPs");
      }
    });
  }, [open, app_id]);

  const assign = async () => {
    setSaving(true);
    setError("");
    const res = await apiAssignSmtp(app_id, selected, makeDefault);
    setSaving(false);
    if (res.status === "success" && res.data) onSuccess(selected, res.data.is_default);
    else setError(res.message || "Could not assign the SMTP");
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Assign an existing SMTP</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Let {appName ?? "this app"} send through a mail server that's already set up.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {smtps === null && [1, 2].map((i) => <Skeleton key={i} variant="rounded" height={64} sx={{ mb: 1, borderRadius: 2 }} />)}

        {smtps?.length === 0 && !error && (
          <Stack alignItems="center" spacing={1} sx={{ py: 4, color: "text.secondary", textAlign: "center" }}>
            <DnsOutlined sx={{ fontSize: 36, color: "text.disabled" }} />
            <Typography variant="body2">
              There are no other SMTPs to assign. {appName ?? "This app"} already has all of them, or none exist yet.
            </Typography>
          </Stack>
        )}

        <Stack spacing={1}>
          {smtps?.map((s) => {
            const active = s.smtp_id === selected;
            const health = smtpHealth(s);
            return (
              <Box
                key={s.smtp_id}
                onClick={() => setSelected(s.smtp_id)}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: active ? "primary.main" : "divider",
                  bgcolor: (t) => (active ? alpha(t.palette.primary.main, 0.06) : "transparent"),
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}>
                <Radio size="small" checked={active} sx={{ p: 0.5 }} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
                    <Typography variant="body2" fontWeight={700}>
                      {s.smtp_name}
                    </Typography>
                    {s.is_system_defined && <Chip size="small" label="System" sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }} />}
                    <Chip size="small" variant="outlined" color={health.color} label={health.label} sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }} />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                    <Box component="span" sx={{ fontFamily: "monospace" }}>
                      {s.host}:{s.port}
                    </Box>{" "}
                    · {securityLabel(s.security)} · from {s.sender_email}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {s.app_count} app{s.app_count === 1 ? "" : "s"}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        {Boolean(smtps?.length) &&
          (appHasDefault ? (
            <FormControlLabel
              sx={{ mt: 2 }}
              control={<Switch checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} />}
              label={<Typography variant="body2" fontWeight={600}>Make it the default SMTP</Typography>}
            />
          ) : (
            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              {appName ?? "This app"} has no default SMTP yet, so this one will become the default.
            </Alert>
          ))}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant="contained" disableElevation disabled={!selected} loading={saving} onClick={assign}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
