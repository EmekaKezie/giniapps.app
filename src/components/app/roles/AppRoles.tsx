import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { Add, DeleteOutline, LockOutlined } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import type { IPermissionModule, IRole } from "@appTypes/IRole";
import { apiDeleteRole, apiGetPermissionModules, apiGetRoles, apiUpdateRolePermissions } from "@api/roleApi";
import PageHeader from "@components/common/PageHeader";
import MockBanner from "@components/common/MockBanner";
import ConfirmDialog from "@components/common/ConfirmDialog";
import CreateRoleDialog from "./CreateRoleDialog";

export default function AppRoles() {
  const { app_id, app } = useCurrentApp();

  const [roles, setRoles] = useState<IRole[]>([]);
  const [modules, setModules] = useState<IPermissionModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = async (selectId?: string) => {
    const [r, m] = await Promise.all([apiGetRoles(app_id), apiGetPermissionModules()]);
    const list = r.data ?? [];
    setRoles(list);
    setModules(m.data ?? []);
    const next = list.find((x) => x.role_id === selectId) ?? list.find((x) => x.role_id === selectedId) ?? list[0];
    if (next) {
      setSelectedId(next.role_id);
      setDraft(next.permissions);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [app_id]);

  const selected = roles.find((r) => r.role_id === selectedId);
  const locked = Boolean(selected?.is_system);
  const dirty = useMemo(() => {
    if (!selected) return false;
    const a = [...selected.permissions].sort().join();
    const b = [...draft].sort().join();
    return a !== b;
  }, [selected, draft]);

  const selectRole = (role: IRole) => {
    if (dirty && !window.confirm("Discard unsaved permission changes?")) return;
    setSelectedId(role.role_id);
    setDraft(role.permissions);
  };

  const toggle = (key: string) =>
    setDraft((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]));

  const toggleModule = (mod: IPermissionModule, on: boolean) => {
    const keys = mod.permissions.map((p) => p.key);
    setDraft((d) => (on ? [...new Set([...d, ...keys])] : d.filter((k) => !keys.includes(k))));
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    await apiUpdateRolePermissions(app_id, selected.role_id, draft);
    setRoles((prev) => prev.map((r) => (r.role_id === selected.role_id ? { ...r, permissions: [...draft] } : r)));
    enqueueSnackbar(`Permissions for ${selected.name} saved`, { variant: "success" });
    setSaving(false);
  };

  const remove = async () => {
    if (!selected) return;
    await apiDeleteRole(app_id, selected.role_id);
    enqueueSnackbar(`Role "${selected.name}" deleted`, { variant: "success" });
    setConfirmDelete(false);
    setSelectedId("");
    load(roles.find((r) => r.role_id !== selected.role_id)?.role_id);
  };

  const totalPerms = modules.reduce((n, m) => n + m.permissions.length, 0);

  return (
    <Box>
      <PageHeader
        title="Roles & Permissions"
        subtitle={`Control what each user of ${app?.app_name ?? "this app"} can see and change.`}
        actions={
          <Button
            variant="contained"
            disableElevation
            startIcon={<Add />}
            onClick={() => setOpenCreate(true)}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            New role
          </Button>
        }
      />
      <MockBanner feature="Roles & permissions" />

      <Grid container spacing={2.5}>
        {/* Role list */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <List sx={{ p: 1 }}>
              {loading &&
                [1, 2, 3, 4].map((i) => (
                  <Box key={i} sx={{ p: 1.5 }}>
                    <Skeleton width="50%" />
                    <Skeleton width="80%" />
                  </Box>
                ))}
              {roles.map((r) => {
                const active = r.role_id === selectedId;
                return (
                  <ListItemButton
                    key={r.role_id}
                    onClick={() => selectRole(r)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      alignItems: "flex-start",
                      flexDirection: "column",
                      bgcolor: (t) => (active ? alpha(t.palette.primary.main, 0.1) : "transparent"),
                      border: "1px solid",
                      borderColor: active ? "primary.main" : "transparent",
                    }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
                      <Typography variant="body2" fontWeight={700} sx={{ flexGrow: 1 }}>
                        {r.name}
                      </Typography>
                      {r.is_system && <LockOutlined sx={{ fontSize: 14, color: "text.secondary" }} />}
                      <Chip size="small" label={`${r.user_count} user${r.user_count === 1 ? "" : "s"}`} sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                      {r.description || "No description"}
                    </Typography>
                  </ListItemButton>
                );
              })}
            </List>
          </Card>
        </Grid>

        {/* Permission matrix */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            {!selected ? (
              <Box sx={{ p: 3 }}>
                <Skeleton height={40} />
                <Skeleton height={200} />
              </Box>
            ) : (
              <>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {selected.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {draft.length} of {totalPerms} permissions granted
                    </Typography>
                  </Box>
                  {!locked && (
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteOutline />}
                      disabled={selected.user_count > 0}
                      title={selected.user_count > 0 ? "Move users to another role first" : undefined}
                      onClick={() => setConfirmDelete(true)}
                      sx={{ textTransform: "none" }}>
                      Delete role
                    </Button>
                  )}
                </Stack>
                <Divider />

                {locked && (
                  <Alert severity="info" icon={<LockOutlined fontSize="small" />} sx={{ m: 2, mb: 0, borderRadius: 2 }}>
                    {selected.name} is a system role with full access and can't be edited.
                  </Alert>
                )}

                <Box sx={{ px: 3, py: 1 }}>
                  {modules.map((mod, i) => {
                    const keys = mod.permissions.map((p) => p.key);
                    const granted = keys.filter((k) => draft.includes(k)).length;
                    return (
                      <Box key={mod.module}>
                        {i > 0 && <Divider />}
                        <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} sx={{ py: 1.5 }} spacing={1}>
                          <FormControlLabel
                            sx={{ width: { sm: 220 }, flexShrink: 0, m: 0 }}
                            control={
                              <Checkbox
                                size="small"
                                disabled={locked}
                                checked={granted === keys.length}
                                indeterminate={granted > 0 && granted < keys.length}
                                onChange={(e) => toggleModule(mod, e.target.checked)}
                              />
                            }
                            label={
                              <Typography variant="body2" fontWeight={700}>
                                {mod.label}
                              </Typography>
                            }
                          />
                          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                            {mod.permissions.map((p) => (
                              <FormControlLabel
                                key={p.key}
                                sx={{ mr: 2 }}
                                control={
                                  <Checkbox size="small" disabled={locked} checked={draft.includes(p.key)} onChange={() => toggle(p.key)} />
                                }
                                label={<Typography variant="body2">{p.label}</Typography>}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      </Box>
                    );
                  })}
                </Box>

                {!locked && (
                  <>
                    <Divider />
                    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ px: 3, py: 2 }}>
                      <Button color="inherit" disabled={!dirty || saving} onClick={() => setDraft(selected.permissions)}>
                        Discard
                      </Button>
                      <Button variant="contained" disableElevation disabled={!dirty} loading={saving} onClick={save}>
                        Save changes
                      </Button>
                    </Stack>
                  </>
                )}
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      {openCreate && (
        <CreateRoleDialog
          open={openCreate}
          app_id={app_id}
          roles={roles}
          onClose={() => setOpenCreate(false)}
          onSuccess={(role) => {
            setOpenCreate(false);
            load(role.role_id);
          }}
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete role?"
        message={`"${selected?.name}" will be removed. This can't be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={remove}
        onClose={() => setConfirmDelete(false)}
      />
    </Box>
  );
}
