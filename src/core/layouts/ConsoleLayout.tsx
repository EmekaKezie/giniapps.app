import { AppBar, Box, Container, Toolbar } from "@mui/material";
import type { ReactNode } from "react";
import BrandMark from "@core/navs/BrandMark";
import UserMenu from "@core/navs/UserMenu";

type TProps = {
  children: ReactNode;
};

/** Top-bar-only layout for the app console (`/apps`). No drawer here. */
export default function ConsoleLayout({ children }: TProps) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}>
        <Toolbar sx={{ gap: 2 }}>
          <BrandMark />
          <Box sx={{ flexGrow: 1 }} />
          <UserMenu variant="avatar" />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>
    </Box>
  );
}
