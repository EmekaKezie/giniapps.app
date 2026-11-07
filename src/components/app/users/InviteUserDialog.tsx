import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import type { IRole } from "@appTypes/IRole";
import type { IInviteAppUserRequest } from "@appTypes/IAppUser";
import { apiInviteAppUser } from "@api/appUserApi";
import { handleApiError } from "@core/helper/apiErrorHandler";

type TProps = {
  open: boolean;
  app_id: string;
  appName?: string;
  roles: IRole[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function InviteUserDialog({ open, app_id, appName, roles, onClose, onSuccess }: TProps) {
  const [saving, setSaving] = useState(false);
  const assignable = roles.filter((r) => r.role_id !== "role_owner");

  const formik = useFormik<IInviteAppUserRequest>({
    initialValues: { email: "", role_id: assignable[0]?.role_id ?? "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Enter a valid email").required("Email is required"),
      role_id: Yup.string().required("Pick a role"),
    }),
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const res = await apiInviteAppUser(app_id, values);
        if (res.status === "success") {
          enqueueSnackbar(`Invitation sent to ${values.email}`, { variant: "success" });
          onSuccess();
        } else {
          handleApiError(res, enqueueSnackbar);
        }
      } finally {
        setSaving(false);
      }
    },
  });

  const selectedRole = roles.find((r) => r.role_id === formik.values.role_id);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Invite user</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            They'll get an email with a link to manage {appName ?? "this app"}.
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              fullWidth
              label="Email address"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role_id"
              value={formik.values.role_id}
              onChange={formik.handleChange}
              helperText={selectedRole?.description}>
              {assignable.map((r) => (
                <MenuItem key={r.role_id} value={r.role_id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disableElevation loading={saving}>
            Send invite
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
