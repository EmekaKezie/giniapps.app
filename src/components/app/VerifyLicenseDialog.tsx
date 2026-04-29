import type { IAppView } from "@appTypes/IApp";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { Close, Security, Link } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { apiApplyLicense } from "@api/licenseApi";
import type {
  IApplyLicenseRequest,
  IApplyLicenseResponse,
} from "@appTypes/ILicense";
import type { IApiRes } from "@appTypes/IAap";
import { handleApiError } from "@core/helper/apiErrorHandler";

type TProps = {
  open: boolean;
  app: IAppView;
  onClose: () => void;
  onSuccess: () => void;
};

export default function VerifyLicenseDialog({
  open,
  app,
  onClose,
  onSuccess,
}: TProps) {
  const [isValidating, setIsValidating] = useState(false);

  const urls: string[] = app?.authorized_urls?.split(",") || [];
  const license_validation_urls = urls?.map((i) => {
    return `${i}/license/validate`;
  });

  const formik = useFormik({
    initialValues: {
      url: "",
      license: app.generated_license || "",
    },
    validationSchema: Yup.object({
      url: Yup.string()
        // .url("Enter a valid URL")
        .required("Target URL is required"),
      license: Yup.string().required("License string is required"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsValidating(true);
      try {
        // Assuming your API verifies the license against the provided URL
        const payload: IApplyLicenseRequest = {
          license: values.license,
        };

        const res: IApiRes<IApplyLicenseResponse> = await apiApplyLicense(
          values.url,
          payload,
        );
        if (res.status === "success") {
          enqueueSnackbar(res?.message!, {
            variant: "success",
            anchorOrigin: { horizontal: "left", vertical: "bottom" },
          });
          onSuccess();
        } else {
          handleApiError(res, enqueueSnackbar);
        }
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Failed to apply license. Please try again", {
          variant: "default",
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
        });
      } finally {
        setIsValidating(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      scroll="paper">
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Security color="primary" />
            <Typography variant="h6" fontWeight="700">
              Apply License
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2">
                {app.app_name} ({app.app_code})
              </Typography>
            </Box>

            <Box>
              {license_validation_urls?.map((i) => {
                return (
                  <Chip
                    label={i}
                    onClick={() => {
                      formik.setFieldValue("url", i);
                    }}
                    size="small"
                    onDelete={() => {
                      formik.setFieldValue("url", "");
                    }}
                    color={formik.values.url === i ? "info" : "default"}
                  />
                );
              })}
            </Box>

            <TextField
              fullWidth
              name="url"
              label="Validation Endpoint URL"
              placeholder="https://api.yourapp.com/v1/verify"
              value={formik.values.url}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.url && Boolean(formik.errors.url)}
              helperText={formik.touched.url && formik.errors.url}
              InputProps={{
                startAdornment: (
                  <Link
                    fontSize="small"
                    sx={{ mr: 1, color: "action.active" }}
                  />
                ),
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              name="license"
              label="License String"
              value={formik.values.license}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.license && Boolean(formik.errors.license)}
              helperText={formik.touched.license && formik.errors.license}
              sx={{ fontFamily: "monospace" }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button
            onClick={handleClose}
            color="inherit"
            sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            loading={isValidating}
            sx={{ textTransform: "none", px: 4 }}>
            Run Validation
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
