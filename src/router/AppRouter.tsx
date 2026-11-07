import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "../core/themes/darkTheme";
import { lightTheme } from "../core/themes/lightTheme";
import { useAppSelector } from "../redux/useRedux";
import PageNotFound from "../core/feedback/PageNotFound";
import SessionExpiredDialog from "@core/feedback/SessionExpiredDialog";
import AuthourizeLoginPage from "@pages/AuthourizeLoginPage";
import AppPage from "@pages/AppPage";
import AuthLayout from "@core/layouts/AuthLayout";
import RequireAuth from "./RequireAuth";
import { ALL_APP_MENU_ITEMS } from "./appMenu";
import { AUTH_TOKEN } from "@core/storage/authstorage";

const LOGIN_URL = "/auth/login/authourize";

export default function AppRouter() {
  const themeStore = useAppSelector((state) => state.themeReducer);
  const theme = !themeStore.darkTheme ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SessionExpiredDialog />
        <Routes>
          {/* No landing page: go straight to the console or to login */}
          <Route
            path="/"
            element={<Navigate to={AUTH_TOKEN() ? "/apps" : LOGIN_URL} replace />}
          />
          <Route path={LOGIN_URL} element={<AuthourizeLoginPage />} />

          <Route element={<RequireAuth />}>
            {/* Console: list of all Ginimeg apps */}
            <Route path="/apps" element={<AppPage />} />

            {/* Workspace for one app, with its own drawer */}
            <Route path="/apps/:app_id" element={<AuthLayout />}>
              {ALL_APP_MENU_ITEMS.map((item) =>
                item.path === "" ? (
                  <Route key={item.id} index element={item.component} />
                ) : (
                  <Route
                    key={item.id}
                    path={item.path}
                    element={item.component}
                  />
                ),
              )}
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
