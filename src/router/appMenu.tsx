/**
 * Menu for the app workspace (`/apps/:app_id/...`).
 * Drives both the drawer and the nested routes, so adding a page here is
 * all that is needed to wire it up.
 */
import type { IAppMenuGroup } from "@appTypes/IAap";
import {
  DashboardOutlined,
  VpnKeyOutlined,
  PeopleAltOutlined,
  AdminPanelSettingsOutlined,
  DnsOutlined,
  MarkEmailReadOutlined,
  HistoryOutlined,
  SettingsOutlined,
  OutboxOutlined,
} from "@mui/icons-material";
import AppEmailOutbox from "@components/app/emails/AppEmailOutbox";
import AppOverview from "@components/app/overview/AppOverview";
import AppCredentials from "@components/app/credentials/AppCredentials";
import AppUsers from "@components/app/users/AppUsers";
import AppRoles from "@components/app/roles/AppRoles";
import AppSmtp from "@components/app/smtp/AppSmtp";
import AppEmailTemplates from "@components/app/templates/AppEmailTemplates";
import AppAuditLogs from "@components/app/audit/AppAuditLogs";
import AppSettings from "@components/app/settings/AppSettings";

export const APP_MENU: IAppMenuGroup[] = [
  {
    items: [
      {
        id: "overview",
        path: "",
        label: "Overview",
        icon: <DashboardOutlined />,
        component: <AppOverview />,
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        id: "credentials",
        path: "credentials",
        label: "Credentials & License",
        icon: <VpnKeyOutlined />,
        component: <AppCredentials />,
      },
    ],
  },
  {
    label: "Access",
    items: [
      {
        id: "users",
        path: "users",
        label: "Users",
        icon: <PeopleAltOutlined />,
        component: <AppUsers />,
        preview: true,
      },
      {
        id: "roles",
        path: "roles",
        label: "Roles & Permissions",
        icon: <AdminPanelSettingsOutlined />,
        component: <AppRoles />,
        preview: true,
      },
    ],
  },
  {
    label: "Messaging",
    items: [
      {
        id: "email-outbox",
        path: "email-outbox",
        label: "Email Outbox",
        icon: <OutboxOutlined />,
        component: <AppEmailOutbox />,
      },
      {
        id: "smtp",
        path: "smtp",
        label: "SMTP",
        icon: <DnsOutlined />,
        component: <AppSmtp />,
      },
      {
        id: "email-templates",
        path: "email-templates",
        label: "Email Templates",
        icon: <MarkEmailReadOutlined />,
        component: <AppEmailTemplates />,
        preview: true,
      },
    ],
  },
  {
    label: "Monitoring",
    items: [
      {
        id: "audit-logs",
        path: "audit-logs",
        label: "Audit Logs",
        icon: <HistoryOutlined />,
        component: <AppAuditLogs />,
        preview: true,
      },
    ],
  },
];

/** Pinned to the bottom of the drawer. */
export const APP_MENU_FOOTER = [
  {
    id: "settings",
    path: "settings",
    label: "Settings",
    icon: <SettingsOutlined />,
    component: <AppSettings />,
    preview: true,
  },
];

export const ALL_APP_MENU_ITEMS = [
  ...APP_MENU.flatMap((g) => g.items),
  ...APP_MENU_FOOTER,
];
