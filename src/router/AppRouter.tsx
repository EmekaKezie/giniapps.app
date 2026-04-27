import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useMenu } from "./useMenu";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "../core/themes/darkTheme";
import { lightTheme } from "../core/themes/lightTheme";
import { useAppSelector } from "../redux/useRedux";
import PageNotFound from "../core/feedback/PageNotFound";
import SessionExpiredDialog from "@core/feedback/SessionExpiredDialog";
export default function AppRouter() {
  const themeStore = useAppSelector((state) => state.themeReducer);
  const menu = useMenu();
  const theme = !themeStore.darkTheme ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <SessionExpiredDialog />
        <Routes>
          {menu.map((route, index) => {
            route.subMenu?.map((subRoute) => {
              return (
                <Route
                  key={subRoute.value}
                  path={subRoute.url}
                  element={subRoute.component}
                />
              );
            });

            return (
              <Route key={index} path={route.url} element={route.component} />
            );
          })}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
