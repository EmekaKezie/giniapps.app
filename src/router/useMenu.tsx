import type { IMenu } from "@appTypes/IAap";
import { AppsOutlined } from "@mui/icons-material";
import HomePage from "@pages/HomePage";
import AppPage from "@pages/AppPage";
import AuthourizeLoginPage from "@pages/AuthourizeLoginPage";
import AppViewPage from "@pages/AppViewPage";

export function useMenu() {
  const menu: IMenu[] = [
    //#region Explore Pages
    {
      id: "home",
      url: "/",
      displayName: "Home",
      visible: true,
      component: <HomePage />,
      group: "explore",
      subMenu: [],
    },

    {
      id: "authourize",
      url: "/auth/login/authourize",
      displayName: "Login",
      visible: true,
      component: <AuthourizeLoginPage />,
      group: "explore",
      subMenu: [],
    },

    {
      id: "apps",
      url: "/apps",
      displayName: "Apps",
      visible: true,
      icon: <AppsOutlined />,
      component: <AppPage />,
      group: "admin",
      subMenu: [],
    },

    {
      id: "app_view",
      url: "/apps/:app_id",
      displayName: "Apps",
      visible: true,
      icon: <AppsOutlined />,
      component: <AppViewPage />,
      group: "ungrouped",
      subMenu: [],
    },
  ];

  return menu;
}
