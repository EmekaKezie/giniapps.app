import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { endOfDay, format, isSameYear, startOfDay, subDays } from "date-fns";
import { useEffect, useState } from "react";
import type { IEmailOutboxFilter } from "@api/emailOutboxApi";
import { EMAIL_STATUS_OPTIONS, emailStatus } from "./emailStatus";

type TRange = "any" | "today" | "7d" | "30d" | "custom";

const RANGE_LABELS: Record<TRange, string> = {
  any: "Any time",
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  custom: "Custom range",
};

type TProps = {
  onChange: (filter: IEmailOutboxFilter) => void;
  /** SMTPs the app can filter by; the SMTP dropdown hides when empty. */
  smtps?: { smtp_id: string; smtp_name: string }[];
};

const valid = (d: Date | null): d is Date => Boolean(d && !isNaN(d.getTime()));

/** e.g. "3 Nov – 7 Nov 2026", "From 3 Nov 2026", "Until 7 Nov 2026" */
const customLabel = (from: Date | null, to: Date | null) => {
  const full = (d: Date) => format(d, "d MMM yyyy");
  if (valid(from) && valid(to)) {
    return `${isSameYear(from, to) ? format(from, "d MMM") : full(from)} – ${full(to)}`;
  }
  if (valid(from)) return `From ${full(from)}`;
  if (valid(to)) return `Until ${full(to)}`;
  return RANGE_LABELS.custom;
};

/** Recipient search, status, SMTP and date range. Emits ISO bounds in the viewer's local timezone. */
export default function EmailOutboxFilters({ onChange, smtps = [] }: TProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("any");
  const [smtpId, setSmtpId] = useState("any");
  const [range, setRange] = useState<TRange>("any");
  // applied custom range
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  // custom range dialog (draft values until Apply)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState<Date | null>(null);
  const [draftTo, setDraftTo] = useState<Date | null>(null);

  // debounce typing so we don't call the API on every keystroke
  const [recipient, setRecipient] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setRecipient(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const now = new Date();
    let bounds: { from?: Date; to?: Date } = {};
    if (range === "today") bounds = { from: startOfDay(now), to: endOfDay(now) };
    if (range === "7d") bounds = { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    if (range === "30d") bounds = { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
    if (range === "custom") {
      bounds = {
        from: valid(from) ? startOfDay(from) : undefined,
        to: valid(to) ? endOfDay(to) : undefined,
      };
    }
    onChange({
      recipient: recipient || undefined,
      status: status === "any" ? undefined : status,
      smtp_id: smtpId === "any" ? undefined : smtpId,
      from: bounds.from?.toISOString(),
      to: bounds.to?.toISOString(),
    });
  }, [recipient, status, smtpId, range, from, to]);

  const openCustom = () => {
    setDraftFrom(range === "custom" ? from : null);
    setDraftTo(range === "custom" ? to : null);
    setDialogOpen(true);
  };

  const applyCustom = () => {
    setFrom(valid(draftFrom) ? draftFrom : null);
    setTo(valid(draftTo) ? draftTo : null);
    setRange("custom");
    setDialogOpen(false);
  };

  const draftInvalid =
    (draftFrom !== null && !valid(draftFrom)) || (draftTo !== null && !valid(draftTo));
  const draftInverted =
    valid(draftFrom) && valid(draftTo) && startOfDay(draftFrom) > startOfDay(draftTo);
  const canApply = (valid(draftFrom) || valid(draftTo)) && !draftInvalid && !draftInverted;

  const active = Boolean(search) || status !== "any" || smtpId !== "any" || range !== "any";

  const clear = () => {
    setSearch("");
    setRecipient("");
    setStatus("any");
    setSmtpId("any");
    setRange("any");
    setFrom(null);
    setTo(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        useFlexGap
        sx={{ p: 2 }}
        alignItems={{ md: "center" }}>
        <TextField
          size="small"
          placeholder="Search by recipient email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: { md: 340 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          select
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ minWidth: 150 }}>
          <MenuItem value="any">Any status</MenuItem>
          {EMAIL_STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {emailStatus(s).label}
            </MenuItem>
          ))}
        </TextField>
        {smtps.length > 0 && (
          <TextField
            select
            size="small"
            value={smtpId}
            onChange={(e) => setSmtpId(e.target.value)}
            sx={{ minWidth: 170, maxWidth: { md: 240 } }}>
            <MenuItem value="any">Any SMTP</MenuItem>
            {smtps.map((s) => (
              <MenuItem key={s.smtp_id} value={s.smtp_id}>
                {s.smtp_name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          select
          size="small"
          value={range}
          onChange={(e) => {
            // "Custom range" opens the dialog instead (see its onClick)
            if (e.target.value !== "custom") setRange(e.target.value as TRange);
          }}
          slotProps={{
            select: {
              renderValue: (v) => (v === "custom" ? customLabel(from, to) : RANGE_LABELS[v as TRange]),
            },
          }}
          sx={{ minWidth: 160 }}>
          <MenuItem value="any">{RANGE_LABELS.any}</MenuItem>
          <MenuItem value="today">{RANGE_LABELS.today}</MenuItem>
          <MenuItem value="7d">{RANGE_LABELS["7d"]}</MenuItem>
          <MenuItem value="30d">{RANGE_LABELS["30d"]}</MenuItem>
          {/* onClick also fires when it's already selected, so the range can be edited */}
          <MenuItem value="custom" onClick={openCustom}>
            {RANGE_LABELS.custom}…
          </MenuItem>
        </TextField>
        {active && (
          <Button
            color="inherit"
            startIcon={<Close />}
            onClick={clear}
            sx={{ textTransform: "none", flexShrink: 0, ml: { md: "auto" }, alignSelf: { xs: "flex-start", md: "center" } }}>
            Clear filters
          </Button>
        )}
      </Stack>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Custom date range</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <DatePicker
              label="Start date"
              value={draftFrom}
              onChange={setDraftFrom}
              maxDate={valid(draftTo) ? draftTo : undefined}
              disableFuture
              slotProps={{ textField: { fullWidth: true }, field: { clearable: true } }}
            />
            <DatePicker
              label="End date"
              value={draftTo}
              onChange={setDraftTo}
              minDate={valid(draftFrom) ? draftFrom : undefined}
              disableFuture
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: draftInverted,
                  helperText: draftInverted ? "Must be on or after the start date" : "Leave either blank for an open range",
                },
                field: { clearable: true },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={applyCustom} disabled={!canApply} sx={{ textTransform: "none", fontWeight: 700 }}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
