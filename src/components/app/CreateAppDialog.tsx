import { useState } from "react";
import { Add, Close, CloudUpload, Language, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  Typography,
  Chip,
  alpha,
  useTheme,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { ICreateAppRequest } from "@appTypes/IApp";
import type { IApiRes } from "@appTypes/IAap";
import { apiCreateApp } from "@api/appApi";
import { handleApiError } from "@core/helper/apiErrorHandler";
import { enqueueSnackbar } from "notistack";

type TProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateAppDialog({ open, onClose, onSuccess }: TProps) {
  const theme = useTheme();
  const [urlInput, setUrlInput] = useState("");
  const [creating, setCreating] = useState(false);

  const formik = useFormik<ICreateAppRequest>({
    initialValues: {
      app_name: "",
      app_code: "",
      is_active: true,
      is_live: false,
      authorized_urls: [],
      app_logo: null,
    },
    validationSchema: Yup.object({
      app_name: Yup.string().required("App name is required"),
      app_code: Yup.string()
        .required("App code is required")
        .matches(/^[a-z0-9-]+$/, "Use lowercase, numbers, and hyphens only"),
    }),
    onSubmit: async (values) => {
      setCreating(true);
      try {
        const res: IApiRes<string> = await apiCreateApp(values);
        if (res?.status === "success") {
          formik.resetForm();
          onSuccess();
        } else {
          handleApiError(res, enqueueSnackbar);
        }
      } catch (error) {
        enqueueSnackbar("Something went wrong. Please try again", {
          variant: "default",
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
        });
      } finally {
        setCreating(true);
      }
    },
  });

  const addUrl = () => {
    if (urlInput && !formik.values.authorized_urls.includes(urlInput)) {
      formik.setFieldValue("authorized_urls", [
        ...formik.values.authorized_urls,
        urlInput,
      ]);
      setUrlInput("");
    }
  };

  const removeUrl = (urlToDelete: string) => {
    formik.setFieldValue(
      "authorized_urls",
      formik.values.authorized_urls.filter((url) => url !== urlToDelete),
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 3, boxShadow: "0 24px 48px rgba(0,0,0,0.1)" },
      }}>
      <DialogTitle sx={{ p: 3, pb: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 1,
                borderRadius: 1,
                display: "flex",
              }}>
              <Add color="primary" />
            </Box>
            <Typography variant="h6" fontWeight="800">
              New Application
            </Typography>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: "text.disabled" }}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          {/* <TextField
            fullWidth
            label="App Name"
            name="app_name"
            value={formik.values.app_name}
            onChange={formik.handleChange}
            error={formik.touched.app_name && Boolean(formik.errors.app_name)}
            helperText={formik.touched.app_name && formik.errors.app_name}
          />

          <TextField
            fullWidth
            label="App Code"
            name="app_code"
            placeholder="e.g. prime-pak"
            value={formik.values.app_code}
            onChange={formik.handleChange}
            error={formik.touched.app_code && Boolean(formik.errors.app_code)}
            helperText={formik.touched.app_code && formik.errors.app_code}
          /> */}

          <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="App Name"
                  name="app_name"
                  value={formik.values.app_name}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.app_name && Boolean(formik.errors.app_name)
                  }
                  helperText={formik.touched.app_name && formik.errors.app_name}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="App Code"
                  name="app_code"
                  placeholder="e.g. prime-pak"
                  value={formik.values.app_code}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.app_code && Boolean(formik.errors.app_code)
                  }
                  helperText={formik.touched.app_code && formik.errors.app_code}
                />
              </Grid>
            </Grid>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 4 }}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}>
            <FormControlLabel
              sx={{
                justifyContent: { xs: "space-between", sm: "flex-start" },
                width: { xs: "100%", sm: "auto" },
                m: 0,
              }}
              control={
                <Switch
                  name="is_active"
                  checked={formik.values.is_active}
                  onChange={formik.handleChange}
                />
              }
              label={
                <Typography variant="body2" fontWeight="700">
                  Active Status
                </Typography>
              }
            />

            <FormControlLabel
              sx={{
                justifyContent: { xs: "space-between", sm: "flex-start" },
                width: { xs: "100%", sm: "auto" },
                m: 0,
              }}
              control={
                <Switch
                  name="is_live"
                  checked={formik.values.is_live}
                  onChange={formik.handleChange}
                />
              }
              label={
                <Typography variant="body2" fontWeight="700">
                  Production Mode
                </Typography>
              }
            />
          </Stack>
          {/* URL Management */}
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Language fontSize="small" /> Authorized URLs
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="https://app.ginimeg.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addUrl())
                }
              />
              <Button
                variant="outlined"
                onClick={addUrl}
                sx={{ fontWeight: 700 }}>
                Add
              </Button>
            </Stack>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {formik.values.authorized_urls.map((url) => (
                <Chip
                  key={url}
                  label={url}
                  onDelete={() => removeUrl(url)}
                  deleteIcon={<Delete />}
                  variant="outlined"
                  sx={{ borderRadius: 1.5, fontWeight: 600 }}
                />
              ))}
            </Box>
          </Box>

          <Button
            component="label"
            fullWidth
            startIcon={<CloudUpload />}
            sx={{
              py: 2,
              borderStyle: "dashed",
              borderWidth: 2,
              borderColor: "divider",
              color: "text.secondary",
            }}>
            Upload App Logo
            <input type="file" hidden />
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ p: 3, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ fontWeight: 700 }}
          disabled={creating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={() => formik.handleSubmit()}
          disabled={creating}
          startIcon={creating && <CircularProgress size={20} />}
          sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 800 }}>
          Create App
        </Button>
      </DialogActions>
    </Dialog>
  );
}
