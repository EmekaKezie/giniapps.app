import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  PersonAddAlt1Outlined,
  MoreVert,
  Search,
  BlockOutlined,
  CheckCircleOutline,
  DeleteOutline,
  ForwardToInboxOutlined,
  PeopleAltOutlined,
} from "@mui/icons-material";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "@core/context/CurrentAppContext";
import type { IAppUser, TAppUserStatus } from "@appTypes/IAppUser";
import type { IRole } from "@appTypes/IRole";
import { apiGetAppUsers, apiRemoveAppUser, apiUpdateAppUser } from "@api/appUserApi";
import { apiGetRoles } from "@api/roleApi";
import { colorFromString, initials, timeAgo } from "@core/helper/format";
import PageHeader from "@components/common/PageHeader";
import MockBanner from "@components/common/MockBanner";
import ConfirmDialog from "@components/common/ConfirmDialog";
import InviteUserDialog from "./InviteUserDialog";

const STATUS_CHIP: Record<TAppUserStatus, { label: string; color: "success" | "warning" | "default" }> = {
  active: { label: "Active", color: "success" },
  invited: { label: "Invited", color: "warning" },
  suspended: { label: "Suspended", color: "default" },
};

export default function AppUsers() {
  const { app_id, app } = useCurrentApp();
  const navigate = useNavigate();

  const [users, setUsers] = useState<IAppUser[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openInvite, setOpenInvite] = useState(false);
  const [menu, setMenu] = useState<{ el: HTMLElement; user: IAppUser } | null>(null);
  const [toRemove, setToRemove] = useState<IAppUser | null>(null);
  const [removing, setRemoving] = useState(false);

  const load = async () => {
    const [u, r] = await Promise.all([apiGetAppUsers(app_id), apiGetRoles(app_id)]);
    setUsers(u.data ?? []);
    setRoles(r.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [app_id]);

  const roleName = (id: string) => roles.find((r) => r.role_id === id)?.name ?? "—";

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter(
      (u) =>
        (roleFilter === "all" || u.role_id === roleFilter) &&
        (!q || `${u.firstname} ${u.lastname} ${u.email}`.toLowerCase().includes(q)),
    );
  }, [users, search, roleFilter]);

  const update = async (user: IAppUser, param: Partial<Pick<IAppUser, "role_id" | "status">>, msg: string) => {
    setMenu(null);
    // optimistic update
    setUsers((prev) => prev.map((u) => (u.user_id === user.user_id ? { ...u, ...param } : u)));
    await apiUpdateAppUser(app_id, user.user_id, param);
    enqueueSnackbar(msg, { variant: "success" });
  };

  const remove = async () => {
    if (!toRemove) return;
    setRemoving(true);
    await apiRemoveAppUser(app_id, toRemove.user_id);
    setUsers((prev) => prev.filter((u) => u.user_id !== toRemove.user_id));
    enqueueSnackbar("User removed", { variant: "success" });
    setRemoving(false);
    setToRemove(null);
  };

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle={`People who can sign in to manage ${app?.app_name ?? "this app"}. What they can do depends on their role.`}
        actions={
          <Button
            variant="contained"
            disableElevation
            startIcon={<PersonAddAlt1Outlined />}
            onClick={() => setOpenInvite(true)}
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
            Invite user
          </Button>
        }
      />
      <MockBanner feature="User management" />

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ p: 2 }}>
          <TextField
            size="small"
            placeholder="Search name or email"
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
          <Select size="small" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="all">All roles</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r.role_id} value={r.role_id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <TableContainer>
          <Table sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" } }}>
                <TableCell>User</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last active</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                [1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton height={36} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading &&
                visible.map((u) => {
                  const name = `${u.firstname} ${u.lastname}`.trim();
                  const isOwner = u.role_id === "role_owner";
                  return (
                    <TableRow key={u.user_id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 34, height: 34, fontSize: 13, fontWeight: 700, bgcolor: colorFromString(u.email) }}>
                            {initials(u.firstname, u.lastname)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} noWrap>
                              {name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                              {u.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {isOwner ? (
                          <Chip size="small" label="Owner" color="primary" sx={{ fontWeight: 700 }} />
                        ) : (
                          <Select
                            size="small"
                            variant="standard"
                            disableUnderline
                            value={u.role_id}
                            onChange={(e) => update(u, { role_id: e.target.value }, `${name}'s role changed to ${roleName(e.target.value)}`)}
                            sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                            {roles
                              .filter((r) => r.role_id !== "role_owner")
                              .map((r) => (
                                <MenuItem key={r.role_id} value={r.role_id}>
                                  {r.name}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={STATUS_CHIP[u.status].label}
                          color={STATUS_CHIP[u.status].color}
                          variant="outlined"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {u.status === "invited" ? "Pending invite" : timeAgo(u.last_active)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          disabled={isOwner}
                          onClick={(e: MouseEvent<HTMLElement>) => setMenu({ el: e.currentTarget, user: u })}>
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Stack alignItems="center" spacing={1} sx={{ py: 6, color: "text.secondary" }}>
                      <PeopleAltOutlined sx={{ fontSize: 40, color: "text.disabled" }} />
                      <Typography variant="body2">
                        {users.length ? "No users match your filters." : "No users yet. Invite someone to help manage this app."}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
        Need to change what a role can do?{" "}
        <Box component="span" onClick={() => navigate(`/apps/${app_id}/roles`)} sx={{ color: "primary.main", cursor: "pointer", fontWeight: 700 }}>
          Manage roles & permissions
        </Box>
      </Typography>

      <Menu
        anchorEl={menu?.el}
        open={Boolean(menu)}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 190 } } }}>
        {menu?.user.status === "invited" && (
          <MenuItem
            onClick={() => {
              setMenu(null);
              enqueueSnackbar(`Invite re-sent to ${menu.user.email}`, { variant: "success" });
            }}>
            <ListItemIcon>
              <ForwardToInboxOutlined fontSize="small" />
            </ListItemIcon>
            Resend invite
          </MenuItem>
        )}
        {menu?.user.status === "active" && (
          <MenuItem onClick={() => update(menu.user, { status: "suspended" }, "User suspended")}>
            <ListItemIcon>
              <BlockOutlined fontSize="small" />
            </ListItemIcon>
            Suspend access
          </MenuItem>
        )}
        {menu?.user.status === "suspended" && (
          <MenuItem onClick={() => update(menu.user, { status: "active" }, "User reactivated")}>
            <ListItemIcon>
              <CheckCircleOutline fontSize="small" />
            </ListItemIcon>
            Reactivate
          </MenuItem>
        )}
        <MenuItem
          sx={{ color: "error.main" }}
          onClick={() => {
            setToRemove(menu!.user);
            setMenu(null);
          }}>
          <ListItemIcon>
            <DeleteOutline fontSize="small" color="error" />
          </ListItemIcon>
          Remove from app
        </MenuItem>
      </Menu>

      {openInvite && (
        <InviteUserDialog
          open={openInvite}
          app_id={app_id}
          appName={app?.app_name}
          roles={roles}
          onClose={() => setOpenInvite(false)}
          onSuccess={() => {
            setOpenInvite(false);
            load();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(toRemove)}
        title="Remove user?"
        message={`${toRemove?.email} will lose access to ${app?.app_name ?? "this app"} immediately.`}
        confirmLabel="Remove"
        destructive
        loading={removing}
        onConfirm={remove}
        onClose={() => setToRemove(null)}
      />
    </Box>
  );
}
