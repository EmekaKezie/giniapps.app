import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { IAppSmtp, IVerifySmtpResult } from "@appTypes/ISmtp";
import { apiVerifySmtp } from "@api/smtpApi";
import { AUTH_EMAIL } from "@core/storage/authstorage";

type TProps = {
  open: boolean;
  app_id: string;
  smtp: IAppSmtp;
  onClose: () => void;
  /** Called after every test so the page can refresh the SMTP's status. */
  onDone: () => void;
};

export default function TestSmtpDialog({ open, app_id, smtp, onClose, onDone }: TProps) {
  const [sendEmail, setSendEmail] = useState(true);
  const [recipient, setRecipient] = useState(AUTH_EMAIL() ?? "");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<(IVerifySmtpResult & { message: string }) | null>(null);

  const valid = !sendEmail || /^\S+@\S+\.\S+$/.test(recipient);

  const run = async () => {
    setTesting(true);
    setResult(null);
    const res = await apiVerifySmtp(app_id, smtp.smtp_id, sendEmail ? recipient.trim() : undefined);
    setTesting(false);
    if (res.status === "success" && res.data) {
      setResult({ ...res.data, message: res.message });
      onDone();
    } else {
      setResult({ smtp_id: smtp.smtp_id, verified: false, test_sent: false, error: res.message, message: res.message });
    }
  };

  return (
    <Dialog open={open} onClose={testing ? undefined : onClose} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Test {smtp.smtp_name}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Connects and signs in to <b>{smtp.host}:{smtp.port}</b>. This takes a few seconds.
        </Typography>
        <FormControlLabel
          control={<Checkbox size="small" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
          label={<Typography variant="body2">Also send a test email</Typography>}
        />
        {sendEmail && (
          <TextField fullWidth size="small" label="Send to" value={recipient} onChange={(e) => setRecipient(e.target.value)} sx={{ mt: 1 }} />
        )}
        {result && (
          <Alert severity={result.verified ? "success" : "error"} sx={{ mt: 2, borderRadius: 2, wordBreak: "break-word" }}>
            {result.verified
              ? result.test_sent
                ? `Connection works. A test email was sent to ${recipient}.`
                : "Connection works."
              : result.error || result.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose} disabled={testing}>
          Close
        </Button>
        <Button variant="contained" disableElevation disabled={!valid} loading={testing} onClick={run}>
          {result ? "Test again" : "Run test"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
