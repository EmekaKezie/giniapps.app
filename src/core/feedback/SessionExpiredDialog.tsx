import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
// MUI Rounded Icons look much more modern
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

export default function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Your session has expired.");
  const theme = useTheme();

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setMessage(customEvent.detail);
      }
      setOpen(true);
    };

    window.addEventListener("session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("session-expired", handleSessionExpired);
    };
  }, []);

  const handleLoginRedirect = () => {
    setOpen(false);
    //navigate(`./auth/login/authourize`);
    window.location.href = "/auth/login/authourize";
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          backgroundImage: "none",
        },
      }}>
      <DialogContent sx={{}}>
        <Stack alignItems="center" spacing={3}>
          {/* 1. VISUAL ANCHOR */}
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
            }}>
            <AccessTimeRoundedIcon sx={{ fontSize: 36 }} />
          </Box>

          {/* 2. TEXT HIERARCHY */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{ letterSpacing: "-1px", mb: 1, color: "text.primary" }}>
              Session Expired
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", px: 2, lineHeight: 1.6 }}>
              {message}
            </Typography>
          </Box>

          {/* 3. PRIMARY ACTION */}
          <Button
            fullWidth
            onClick={handleLoginRedirect}
            variant="contained"
            disableElevation
            color="primary"
            startIcon={<LoginRoundedIcon />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              // A dark button on a light theme (or vice versa) creates a premium look
              //bgcolor: "text.primary",
              //color: "background.paper",
              "&:hover": {
                bgcolor: alpha(theme.palette.text.primary, 0.8),
              },
            }}>
            Sign back in to your Account
          </Button>

          {/* 4. FOOTNOTE */}
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", fontWeight: 500 }}>
            For your security, sessions time out after inactivity.
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
