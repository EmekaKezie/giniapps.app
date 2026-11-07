import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FileDownloadOutlined, Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import type { IAuditLog, TAuditCategory } from "@appTypes/IAuditLog";
import { apiGetAuditLogs } from "@api/auditLogApi";
import { colorFromString, formatDate, initials, timeAgo } from "@core/helper/format";
import PageHeader from "@components/common/PageHeader";
import MockBanner from "@components/common/MockBanner";

const CATEGORIES: { value: TAuditCategory; label: string }[] = [
  { value: "auth", label: "Sign-in" },
  { value: "users", label: "Users" },
  { value: "roles", label: "Roles" },
  { value: "smtp", label: "SMTP" },
  { value: "license", label: "License" },
  { value: "settings", label: "Settings" },
];

const exportCsv = (rows: IAuditLog[], appCode: string) => {
  const header = ["time", "actor", "email", "category", "action", "target", "ip"];
  const esc = (v: string | undefined) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    header.join(","),
    ...rows.map((r) =>
      [r.created_date, r.actor_name, r.actor_email, r.category, r.action, r.target, r.ip_address].map(esc).join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${appCode}-audit-log.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function AppAuditLogs() {
  const { app_id, app } = useCurrentApp();

  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | TAuditCategory>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    apiGetAuditLogs(app_id).then((res) => {
      setLogs(res.data ?? []);
      setLoading(false);
    });
  }, [app_id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter(
      (l) =>
        (category === "all" || l.category === category) &&
        (!q || `${l.actor_name} ${l.actor_email} ${l.action} ${l.target ?? ""}`.toLowerCase().includes(q)),
    );
  }, [logs, search, category]);

  useEffect(() => setPage(0), [search, category]);

  const rows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <PageHeader
        title="Audit Logs"
        subtitle={`Who did what in ${app?.app_name ?? "this app"}, and when.`}
        actions={
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            disabled={loading || filtered.length === 0}
            onClick={() => exportCsv(filtered, app?.app_code ?? "app")}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            Export CSV
          </Button>
        }
      />
      <MockBanner feature="Audit logging" />

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search actor, action or target"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { sm: 360 } }}
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
          <Select size="small" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">All activity</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <TableContainer>
          <Table size="small" sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em", py: 1.25 } }}>
                <TableCell>When</TableCell>
                <TableCell>Actor</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>IP address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton height={28} />
                    </TableCell>
                  </TableRow>
                ))}
              {!loading &&
                rows.map((l) => (
                  <TableRow key={l.log_id} hover sx={{ "& td": { py: 1.25 } }}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title={formatDate(l.created_date, true)}>
                        <Typography variant="body2">{timeAgo(l.created_date)}</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: 11, fontWeight: 700, bgcolor: colorFromString(l.actor_name) }}>
                          {initials(...l.actor_name.split(" "))}
                        </Avatar>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {l.actor_name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          label={CATEGORIES.find((c) => c.value === l.category)?.label}
                          sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700 }}
                        />
                        <Typography variant="body2">{l.action}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 240 }}>
                        {l.target ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                        {l.ip_address}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No activity matches your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>
    </Box>
  );
}
