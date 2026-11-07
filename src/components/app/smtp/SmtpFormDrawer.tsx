import {
  Alert,
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import type { IAppSmtp, ISaveSmtpRequest, TSmtpSecurity } from "@appTypes/ISmtp";
import { apiCreateSmtp, apiUpdateSmtp } from "@api/smtpApi";
import { PROVIDER_PRESETS, SECURITY_OPTIONS } from "./smtpOptions";

type TProps = {
  open: boolean;
  app_id: string;
  appName?: string;
  /** null = create a new SMTP */
  smtp: IAppSmtp | null;
  /** Whether the app already has a default SMTP (create only). */
  appHasDefault: boolean;
  onClose: () => void;
  /** testAfterSave: run a connection test once saved */
  onSuccess: (smtp_id: string, testAfterSave: boolean) => void;
};

const emptyValues = (): ISaveSmtpRequest => ({
  smtp_name: "",
  host: "",
  port: 587,
  security: "starttls",
  username: "",
  password: "",
  sender_email: "",
  sender_name: "",
  reply_to_email: "",
  provider_name: "",
  is_default: false,
});

export default function SmtpFormDrawer({ open, app_id, appName, smtp, appHasDefault, onClose, onSuccess }: TProps) {
  const editing = Boolean(smtp);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [testAfterSave, setTestAfterSave] = useState(true);

  const formik = useFormik<ISaveSmtpRequest>({
    initialValues: emptyValues(),
    validationSchema: Yup.object({
      smtp_name: Yup.string().trim().max(100).required("Give this SMTP a name"),
      provider_name: Yup.string().trim().max(100),
      host: Yup.string()
        .trim()
        .required("Host is required")
        .matches(/^[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?$/, "Just the hostname, e.g. smtp.example.com"),
      port: Yup.number().typeError("Port must be a number").integer().min(1).max(65535).required("Port is required"),
      username: Yup.string().trim().max(255),
      password: Yup.string().test("pw", "Password is required", function (v) {
        // new SMTP with a username needs a password; on edit blank keeps the saved one
        return editing || !this.parent.username || Boolean(v);
      }),
      sender_email: Yup.string().trim().email("Enter a valid email").required("Sender email is required"),
      sender_name: Yup.string().trim().max(255),
      reply_to_email: Yup.string().trim().email("Enter a valid email"),
    }),
    onSubmit: async (values) => {
      setServerError("");
      const payload = { ...values, port: Number(values.port) };
      const res = editing
        ? await apiUpdateSmtp(app_id, smtp!.smtp_id, payload)
        : await apiCreateSmtp(app_id, payload);
      if (res.status === "success" && res.data) {
        onSuccess(res.data.smtp_id, testAfterSave);
      } else if (res.status === "invalid_token") {
        window.dispatchEvent(new CustomEvent("session-expired", { detail: res.message }));
      } else {
        setServerError(res.message || "Could not save the SMTP");
      }
    },
  });

  // Load values each time the drawer opens.
  useEffect(() => {
    if (!open) return;
    setServerError("");
    setShowPassword(false);
    setTestAfterSave(true);
    formik.resetForm({
      values: smtp
        ? {
            smtp_name: smtp.smtp_name,
            host: smtp.host,
            port: smtp.port,
            security: (smtp.security as TSmtpSecurity) ?? "starttls",
            username: smtp.username ?? "",
            password: "",
            sender_email: smtp.sender_email,
            sender_name: smtp.sender_name ?? "",
            reply_to_email: smtp.reply_to_email ?? "",
            provider_name: smtp.provider_name ?? "",
          }
        : emptyValues(),
    });
  }, [open, smtp?.smtp_id]);

  const applyPreset = (name: string) => {
    const p = PROVIDER_PRESETS.find((x) => x.name === name);
    formik.setFieldValue("provider_name", name === "custom" ? "custom" : name);
    if (p) {
      formik.setFieldValue("host", p.host);
      formik.setFieldValue("port", p.port);
      formik.setFieldValue("security", p.security);
    }
  };

  const field = (name: keyof ISaveSmtpRequest) => ({
    name,
    value: formik.values[name] as string | number,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: Boolean(formik.touched[name] && formik.errors[name]),
    helperText: formik.touched[name] && (formik.errors[name] as string),
    fullWidth: true,
  });

  const presetValue = PROVIDER_PRESETS.some((p) => p.name === formik.values.provider_name)
    ? formik.values.provider_name
    : formik.values.provider_name
      ? "custom"
      : "";

  const busy = formik.isSubmitting;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={busy ? undefined : onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 560 }, display: "flex", flexDirection: "column" } } }}>
      <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Stack direction="row" alignItems="flex-start" spacing={1} sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={800}>
              {editing ? `Edit ${smtp?.smtp_name}` : "Add SMTP"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {editing
                ? smtp!.app_count > 1
                  ? `Used by ${smtp!.app_count} apps. Changes apply to all of them.`
                  : "Changes apply as soon as you save."
                : `A new mail server for ${appName ?? "this app"}.`}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={busy}>
            <Close />
          </IconButton>
        </Stack>

        {/* Body */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 3, py: 2.5 }}>
          {serverError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {serverError}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField label="Name" placeholder="e.g. Ginivo Zoho" autoFocus {...field("smtp_name")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                select
                fullWidth
                label="Provider"
                value={presetValue}
                onChange={(e) => applyPreset(e.target.value)}
                helperText="Fills in host and port">
                {PROVIDER_PRESETS.map((p) => (
                  <MenuItem key={p.name} value={p.name} sx={{ textTransform: "capitalize" }}>
                    {p.name === "office365" ? "Office 365" : p.name === "ses" ? "Amazon SES" : p.name}
                  </MenuItem>
                ))}
                <MenuItem value="custom">Other / custom</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Server
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Host" placeholder="smtp.example.com" {...field("host")} />
            </Grid>
            <Grid size={{ xs: 7, sm: 3.5 }}>
              <TextField
                select
                label="Security"
                {...field("security")}
                onChange={(e) => {
                  const opt = SECURITY_OPTIONS.find((o) => o.value === e.target.value);
                  formik.setFieldValue("security", e.target.value);
                  if (opt) formik.setFieldValue("port", opt.port);
                }}
                slotProps={{ select: { renderValue: (v) => SECURITY_OPTIONS.find((o) => o.value === v)?.label } }}>
                {SECURITY_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {o.label} · {o.port}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {o.hint}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 5, sm: 2.5 }}>
              <TextField label="Port" type="number" {...field("port")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Username" autoComplete="off" {...field("username")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder={editing && smtp?.has_password ? "Saved, leave blank to keep" : undefined}
                {...field("password")}
                slotProps={{
                  inputLabel: editing && smtp?.has_password ? { shrink: true } : undefined,
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword((s) => !s)}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="overline" color="text.secondary" fontWeight={700}>
                Sender
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="From email" placeholder="no-reply@ginimeg.com" {...field("sender_email")} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="From name (optional)" placeholder="Ginimeg" {...field("sender_name")} />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Reply-to (optional)"
                placeholder="support@ginimeg.com"
                {...field("reply_to_email")}
                helperText={(formik.touched.reply_to_email && formik.errors.reply_to_email) || "Where replies go, if not the From address"}
              />
            </Grid>

            {!editing && (
              <Grid size={12}>
                {appHasDefault ? (
                  <FormControlLabel
                    control={<Switch name="is_default" checked={Boolean(formik.values.is_default)} onChange={formik.handleChange} />}
                    label={
                      <Typography variant="body2" fontWeight={600}>
                        Make this {appName ?? "the app"}'s default SMTP
                      </Typography>
                    }
                  />
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    {appName ?? "This app"} has no default SMTP yet, so this one will become the default.
                  </Alert>
                )}
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Footer */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 3, py: 1.5, borderTop: 1, borderColor: "divider" }}>
          <FormControlLabel
            sx={{ mr: "auto" }}
            control={<Checkbox size="small" checked={testAfterSave} onChange={(e) => setTestAfterSave(e.target.checked)} />}
            label={<Typography variant="body2">Test connection after saving</Typography>}
          />
          <Button color="inherit" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disableElevation loading={busy}>
            {editing ? "Save changes" : "Add SMTP"}
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
}
