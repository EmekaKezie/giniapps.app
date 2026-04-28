import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Grid,
  Card,
  useTheme,
  alpha,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  useMediaQuery,
} from "@mui/material";
import {
  Terminal,
  Security,
  Hub,
  ArrowForward,
  Dashboard,
  SettingsSuggest,
  Dns,
  Code,
  ShieldMoon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const SYSTEM_STATS = [
  { label: "Active Apps", value: "24", icon: <Dashboard fontSize="small" /> },
  {
    label: "Total Licenses",
    value: "1.2k",
    icon: <Security fontSize="small" />,
  },
  { label: "API Health", value: "99.9%", icon: <Dns fontSize="small" /> },
];

const DEV_TOOLS = [
  {
    title: "License Engine",
    desc: "Generate and validate Ed25519 signatures for internal apps.",
    icon: <ShieldMoon color="primary" />,
    path: "/licenses",
  },
  {
    title: "App Registry",
    desc: "Manage API keys, app codes, and environment configurations.",
    icon: <Terminal color="primary" />,
    path: "/apps",
  },
  {
    title: "System Logs",
    desc: "Monitor real-time access logs and license validation attempts.",
    icon: <Hub color="primary" />,
    path: "/logs",
  },
];

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* 1. INTERNAL NAVBAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.default, 0.9),
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", px: "0 !important" }}>
            <Stack
              direction="row"
              spacing={isMobile ? 1 : 2}
              alignItems="center">
              <Avatar
                variant="rounded"
                sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                <SettingsSuggest sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography
                variant={isMobile ? "subtitle2" : "h6"}
                fontWeight={800}
                sx={{ letterSpacing: -0.5 }}>
                GINIAPPS{" "}
                {!isMobile && (
                  <span style={{ fontWeight: 400, opacity: 0.6 }}>
                    Internal
                  </span>
                )}
              </Typography>
              {!isMobile && (
                <Chip
                  label="v2.4.0-stable"
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1, height: 20, fontSize: 10 }}
                />
              )}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {!isMobile && (
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => navigate("/apps")}>
                  Registry
                </Button>
              )}
              <Button
                variant="contained"
                size={isMobile ? "small" : "medium"}
                disableElevation
                sx={{ borderRadius: 1.5, fontWeight: 700 }}
                onClick={() => navigate("/apps")}>
                Console
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 2. CONSOLE HERO SECTION */}
      <Box
        sx={{
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 6 },
          position: "relative",
          overflow: "hidden",
        }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.divider, 0.1)} 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 80%)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack alignItems="center" spacing={3} textAlign="center">
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                color: "primary.main",
                letterSpacing: { xs: 1.5, md: 3 },
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                px: 2,
                borderRadius: 10,
                fontSize: { xs: "0.65rem", md: "0.75rem" },
              }}>
              IN-HOUSE CENTRAL COMMAND
            </Typography>

            <Typography
              variant="h2"
              fontWeight={900}
              sx={{ lineHeight: 1.1, fontSize: { xs: "2rem", md: "4rem" } }}>
              Manage Giniapps <br /> Ecosystem.
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                fontWeight: 400,
                px: 2,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
              }}>
              The unified engine for license orchestration, API security, and
              application lifecycle management for Ginimeg Technology.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: { xs: "100%", sm: "auto" }, px: 4 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth={isMobile}
                onClick={() => navigate("/apps")}
                endIcon={<ArrowForward />}
                sx={{ height: 54, px: 4, borderRadius: 2, fontWeight: 800 }}>
                Go to Registry
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth={isMobile}
                startIcon={<Code />}
                sx={{ height: 54, px: 4, borderRadius: 2, fontWeight: 700 }}>
                Docs
              </Button>
            </Stack>
          </Stack>

          {/* 3. QUICK SYSTEM STATS */}
          <Grid container spacing={2} sx={{ mt: { xs: 4, md: 8 } }}>
            {SYSTEM_STATS.map((stat, i) => (
              <Grid size={{xs:12, sm:4}} key={i}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        width: 40,
                        height: 40,
                      }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={900}>
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ textTransform: "uppercase", fontSize: "0.6rem" }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. OPERATIONAL MODULES */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
          Operational Modules
        </Typography>
        <Grid container spacing={3}>
          {DEV_TOOLS.map((tool, index) => (
            <Grid key={index} size={{xs:12, sm:6, md:4}}>
              <Card
                variant="outlined"
                sx={{
                  p: { xs: 3, md: 4 },
                  height: "100%",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
                    transform: "translateY(-5px)",
                  },
                }}
                onClick={() => navigate(tool.path)}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {tool.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={800}>
                    {tool.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}>
                    {tool.desc}
                  </Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. FOOTER */}
      <Box
        sx={{ py: 4, borderTop: "1px solid", borderColor: "divider", mt: 4 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}>
            <Typography
              variant="caption"
              color="text.disabled"
              textAlign="center">
              © 2026 Ginimeg Technology • Build 882.AF
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                variant="caption"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}>
                System Status
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  cursor: "pointer",
                  "&:hover": { color: "primary.main" },
                }}>
                Security Policy
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
