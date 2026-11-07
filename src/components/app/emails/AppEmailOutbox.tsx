import {
  Box,
  Button,
  Card,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { ErrorOutline, MailOutline, Refresh } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import { apiGetEmailOutbox, type IEmailOutboxFilter } from "@api/emailOutboxApi";
import EmailOutboxFilters from "./EmailOutboxFilters";
import type { IApiRes } from "@appTypes/IAap";
import type { IEmailOutbox } from "@appTypes/IEmailOutbox";
import { handleApiError } from "@core/helper/apiErrorHandler";
import { formatDate, formatTime } from "@core/helper/format";
import PageHeader from "@components/common/PageHeader";
import EmailViewerDrawer from "./EmailViewerDrawer";
import { emailStatus } from "./emailStatus";
import { apiGetSmtps } from "@api/smtpApi";
import type { IAppSmtp } from "@appTypes/ISmtp";

export default function AppEmailOutbox() {
  const { app_id, app } = useCurrentApp();

  const [emails, setEmails] = useState<IEmailOutbox[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selected, setSelected] = useState<IEmailOutbox | null>(null);
  // null until the filter bar reports its initial (empty) state
  const [filter, setFilter] = useState<IEmailOutboxFilter | null>(null);
  const requestId = useRef(0);
  // SMTPs for the filter; a failure just hides that filter
  const [smtps, setSmtps] = useState<IAppSmtp[]>([]);
  useEffect(() => {
    let live = true;
    apiGetSmtps(app_id).then((res) => {
      if (live && res?.status === "success") setSmtps(res.data ?? []);
    });
    return () => {
      live = false;
    };
  }, [app_id]);

  const filtered = Boolean(filter?.recipient || filter?.status || filter?.smtp_id || filter?.from || filter?.to);

  const load = async () => {
    if (!filter) return;
    const id = ++requestId.current;
    setLoading(true);
    setFailed(false);
    try {
      const res: IApiRes<IEmailOutbox[]> = await apiGetEmailOutbox(app_id, page * rowsPerPage, rowsPerPage, filter);
      if (id !== requestId.current) return; // a newer search replaced this one
      if (res?.status === "success") {
        setEmails(res.data ?? []);
        setTotal(res.total ?? res.data?.length ?? 0);
      } else {
        setFailed(true);
        handleApiError(res, enqueueSnackbar);
      }
    } catch {
      if (id !== requestId.current) return;
      setFailed(true);
      enqueueSnackbar("Error fetching emails. Please check your internet", { variant: "error" });
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [app_id, page, rowsPerPage, filter]);

  return (
    <Box>
      <PageHeader
        title="Email Outbox"
        subtitle={`Every email ${app?.app_name ?? "this app"} has sent through GiniSend, newest first.`}
        actions={
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={load}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            Refresh
          </Button>
        }
      />

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <EmailOutboxFilters
          smtps={smtps}
          onChange={(f) => {
            setPage(0);
            setFilter(f);
          }}
        />
        {filtered && !loading && !failed && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 1.5, mt: -0.5 }}>
            {total.toLocaleString()} matching email{total === 1 ? "" : "s"}
          </Typography>
        )}
        <TableContainer sx={{ borderTop: 1, borderColor: "divider" }}>
          <Table sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                    py: 1.25,
                    bgcolor: (t) => (t.palette.mode === "dark" ? "grey.900" : "grey.100"),
                    borderBottom: 2,
                    borderColor: "divider",
                  },
                }}>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Queued</TableCell>
                <TableCell>Recipient</TableCell>
                <TableCell>Sender</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>SMTP host</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Sent</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ "& td": { py: 1.25 } }}>
              {loading &&
                Array.from({ length: 6 }, (_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton height={32} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading &&
                emails.map((e) => {
                  const st = emailStatus(e.status);
                  const err = e.error_message || e.delivery_report?.error_message;
                  return (
                    <TableRow
                      key={e.message_id}
                      hover
                      selected={selected?.message_id === e.message_id}
                      onClick={() => setSelected(e)}
                      sx={{ cursor: "pointer" }}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2">{formatDate(e.created_date)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(e.created_date)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {e.recipient}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" noWrap>
                          {e.sender || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" noWrap color={e.subject ? "text.primary" : "text.secondary"}>
                          {e.subject || "(no subject)"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 160 }}>
                        <Tooltip title={e.smtp?.smtp_name ?? ""} disableHoverListener={!e.smtp}>
                          <Typography variant="body2" noWrap>
                            {e.smtp?.host || "—"}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Chip size="small" label={st.label} color={st.color} variant="outlined" />
                          {err && (
                            <Tooltip title={err}>
                              <ErrorOutline fontSize="small" color="error" />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {e.sent_date ? (
                          <>
                            <Typography variant="body2">{formatDate(e.sent_date)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(e.sent_date)}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not sent
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && emails.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Stack alignItems="center" spacing={1.5} sx={{ py: 8, color: "text.secondary", textAlign: "center" }}>
                      <MailOutline sx={{ fontSize: 44, color: "text.disabled" }} />
                      <Typography fontWeight={700} color="text.primary">
                        {failed ? "Couldn't load emails" : filtered ? "No emails match" : "No emails yet"}
                      </Typography>
                      <Typography variant="body2" sx={{ maxWidth: 380 }}>
                        {failed
                          ? "Something went wrong talking to GiniSend. Try again."
                          : filtered
                            ? "Try a different recipient, status, SMTP or date range."
                            : `Emails ${app?.app_name ?? "this app"} sends through GiniSend will show up here.`}
                      </Typography>
                      {failed && (
                        <Button variant="outlined" size="small" onClick={load}>
                          Try again
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(ev) => {
            setRowsPerPage(parseInt(ev.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Card>

      <EmailViewerDrawer email={selected} onClose={() => setSelected(null)} />
    </Box>
  );
}
