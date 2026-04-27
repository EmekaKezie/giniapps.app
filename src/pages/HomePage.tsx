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
  Divider,
  Link,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  FlashOn,
  Security,
  AutoGraph,
  ArrowForward,
  DescriptionOutlined,
  Twitter,
  LinkedIn,
  GitHub,
  MailOutline,
  LocationOnOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    title: "Instant Invoicing",
    desc: "Create and send professional invoices in under 60 seconds.",
    icon: <FlashOn color="primary" />,
  },
  {
    title: "Secure Payments",
    desc: "Get paid directly via Stripe, PayPal, or Bank Transfer.",
    icon: <Security color="primary" />,
  },
  {
    title: "Smart Tracking",
    desc: "Know exactly when a client opens, views, and pays your invoice.",
    icon: <AutoGraph color="primary" />,
  },
];

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        color: "text.primary",
      }}>
      {/* 1. NAVBAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", px: "0 !important" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <DescriptionOutlined sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight={800} color="text.primary">
                Ginivo
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              {/* <Button
                sx={{ fontWeight: 600 }}
                onClick={() => navigate("/authourize")}>
                Login
              </Button> */}
              <Button
                variant="contained"
                sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
                onClick={() => navigate("/auth/login/authourize")}>
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 2. HERO SECTION */}
      <Box
        sx={{
          pt: { xs: 10, md: 15 },
          pb: { xs: 5, md: 8 },
          textAlign: "center",
          position: "relative",
        }}>
        <Box
          sx={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 400,
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ fontWeight: 800, color: "primary.main", letterSpacing: 2 }}>
            SIMPLE INVOICING FOR MODERN TEAMS
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "5.5rem" },
              fontWeight: 900,
              mb: 3,
              mt: 1,
              lineHeight: 1.1,
            }}>
            Get paid{" "}
            <span style={{ color: theme.palette.primary.main }}>on time</span>,{" "}
            <br />
            every time.
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 6, fontWeight: 400, maxWidth: 650, mx: "auto" }}>
            Ginivo simplifies your billing so you can focus on growing your
            business. No complex accounting, just beautiful invoices.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center">
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                height: 60,
                px: 4,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 800,
              }}>
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                height: 60,
                px: 4,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 700,
              }}>
              View Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 3. DASHBOARD PREVIEW */}
      {/* <Container maxWidth="lg" sx={{ mb: 15 }}>
        <Card sx={{ borderRadius: 6, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.12)", border: "1px solid", borderColor: "divider" }}>
          <Box
            component="img"
            src="http://googleusercontent.com/image_collection/image_retrieval/7532154608319607974_0"
            alt="Ginivo Dashboard Interface"
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </Card>
      </Container> */}

      {/* 4. FEATURES SECTION */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), py: 15 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {FEATURES.map((feature, index) => (
              <Grid key={index} size={{ xs: 12, md: 4 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                    }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={800}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. CONTACT SECTION */}
      <Container maxWidth="lg" sx={{ py: 15 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h3" fontWeight={900} gutterBottom>
              Have questions?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Our team is here to help you set up your first invoice and get
              your business moving.
            </Typography>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  }}>
                  <MailOutline />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Email us
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    support@ginivo.com
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  }}>
                  <LocationOnOutlined />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Headquarters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Billing Ave, San Francisco, CA
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                p: 4,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
              }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
                Get in touch
              </Typography>
              <Stack spacing={2}>
                <Box
                  component="input"
                  placeholder="Your Name"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    outline: "none",
                  }}
                />
                <Box
                  component="input"
                  placeholder="Work Email"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    outline: "none",
                  }}
                />
                <Box
                  component="textarea"
                  placeholder="How can we help?"
                  rows={4}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5, fontWeight: 800 }}>
                  Send Message
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* 6. FOOTER */}
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 10,
          pb: 4,
          borderTop: "1px solid",
          borderColor: "divider",
        }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "primary.main",
                      borderRadius: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <DescriptionOutlined
                      sx={{ color: "white", fontSize: 18 }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={900}>
                    Ginivo
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ maxWidth: 280 }}>
                  Making billing simple for freelancers and small businesses
                  worldwide.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton size="small">
                    <Twitter fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <LinkedIn fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <GitHub fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                {["Features", "Integrations", "Pricing"].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    underline="none"
                    color="text.secondary"
                    variant="body2">
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                {["About Us", "Careers", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    underline="none"
                    color="text.secondary"
                    variant="body2">
                    {item}
                  </Link>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                Stay Updated
              </Typography>
              <Stack direction="row" spacing={1}>
                <Box
                  component="input"
                  placeholder="Email address"
                  sx={{
                    flexGrow: 1,
                    p: 1,
                    px: 2,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Button variant="contained">Join</Button>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ mb: 4 }} />
          <Typography variant="body2" color="text.disabled" textAlign="center">
            © 2026 Ginivo Invoicing Inc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
