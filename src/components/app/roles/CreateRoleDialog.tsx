import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import type { ICreateRoleRequest, IRole } from "@appTypes/IRole";
import { apiCreateRole } from "@api/roleApi";

type TProps = {
  open: boolean;
  app_id: string;
  roles: IRole[];
  onClose: () => void;
  onSuccess: (role: IRole) => void;
};

export default function CreateRoleDialog({ open, app_id, roles, onClose, onSuccess }: TProps) {
  const [saving, setSaving] = useState(false);

  const formik = useFormik<ICreateRoleRequest>({
    initialValues: { name: "", description: "", copy_from_role_id: "" },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .required("Role name is required")
        .test("unique", "A role with this name already exists", (v) =>
          !roles.some((r) => r.name.toLowerCase() === v?.trim().toLowerCase()),
        ),
    }),
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const res = await apiCreateRole(app_id, { ...values, name: values.name.trim() });
        if (res.status === "success" && res.data) {
          enqueueSnackbar(`Role "${res.data.name}" created`, { variant: "success" });
          onSuccess(res.data);
        }
      } finally {
        setSaving(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>New role</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              autoFocus
              fullWidth
              label="Role name"
              name="name"
              placeholder="e.g. Billing manager"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            <TextField
              select
              fullWidth
              label="Start with permissions from"
              name="copy_from_role_id"
              value={formik.values.copy_from_role_id}
              onChange={formik.handleChange}>
              <MenuItem value="">No permissions (start empty)</MenuItem>
              {roles.map((r) => (
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
            Create role
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
