/**
 * In-memory mock store used while the real APIs for app users, roles,
 * SMTP, email templates and audit logs are being built.
 *
 * Data is seeded per app the first time it is requested and lives until the
 * page is reloaded, so create/update/delete actions feel real while testing.
 *
 * When an endpoint goes live, replace the matching function in the
 * corresponding `src/api/*Api.ts` file — pages only depend on those.
 */
import type { IApiRes } from "@appTypes/IAap";
import type { IAppUser } from "@appTypes/IAppUser";
import type { IPermissionModule, IRole } from "@appTypes/IRole";
import type { IEmailTemplate } from "@appTypes/IEmailTemplate";
import type { IAuditLog, TAuditCategory } from "@appTypes/IAuditLog";

export const mockResponse = <T>(
  data: T,
  message = "Successful",
  delay = 450,
): Promise<IApiRes<T>> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          status: "success",
          message,
          data,
          total: Array.isArray(data) ? data.length : undefined,
        }),
      delay,
    ),
  );

export const mockId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const ago = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

//#region Permission catalogue (shared by every app)
export const PERMISSION_MODULES: IPermissionModule[] = [
  {
    module: "users",
    label: "Users",
    permissions: [
      { key: "users.view", label: "View" },
      { key: "users.invite", label: "Invite" },
      { key: "users.update", label: "Update" },
      { key: "users.remove", label: "Remove" },
    ],
  },
  {
    module: "roles",
    label: "Roles & Permissions",
    permissions: [
      { key: "roles.view", label: "View" },
      { key: "roles.create", label: "Create" },
      { key: "roles.update", label: "Update" },
      { key: "roles.delete", label: "Delete" },
    ],
  },
  {
    module: "smtp",
    label: "SMTP",
    permissions: [
      { key: "smtp.view", label: "View" },
      { key: "smtp.create", label: "Create" },
      { key: "smtp.update", label: "Update" },
      { key: "smtp.delete", label: "Delete" },
    ],
  },
  {
    module: "templates",
    label: "Email Templates",
    permissions: [
      { key: "templates.view", label: "View" },
      { key: "templates.update", label: "Update" },
    ],
  },
  {
    module: "license",
    label: "Credentials & License",
    permissions: [
      { key: "license.view", label: "View" },
      { key: "license.generate", label: "Generate" },
      { key: "license.rotate_key", label: "Rotate API key" },
    ],
  },
  {
    module: "audit",
    label: "Audit Logs",
    permissions: [
      { key: "audit.view", label: "View" },
      { key: "audit.export", label: "Export" },
    ],
  },
  {
    module: "settings",
    label: "App Settings",
    permissions: [
      { key: "settings.view", label: "View" },
      { key: "settings.update", label: "Update" },
      { key: "settings.delete_app", label: "Delete app" },
    ],
  },
];

const ALL_PERMISSIONS = PERMISSION_MODULES.flatMap((m) =>
  m.permissions.map((p) => p.key),
);
//#endregion

interface IAppStore {
  users: IAppUser[];
  roles: IRole[];
  templates: IEmailTemplate[];
  logs: IAuditLog[];
}

const stores: Record<string, IAppStore> = {};

const seed = (app_id: string): IAppStore => {
  const roles: IRole[] = [
    {
      role_id: "role_owner",
      app_id,
      name: "Owner",
      description: "Full access, including deleting the app.",
      is_system: true,
      permissions: ALL_PERMISSIONS,
      user_count: 0,
    },
    {
      role_id: "role_admin",
      app_id,
      name: "Admin",
      description: "Manage users, messaging and credentials.",
      is_system: false,
      permissions: ALL_PERMISSIONS.filter((p) => p !== "settings.delete_app"),
      user_count: 0,
    },
    {
      role_id: "role_support",
      app_id,
      name: "Support",
      description: "Help users and check delivery issues.",
      is_system: false,
      permissions: [
        "users.view",
        "users.update",
        "smtp.view",
        "templates.view",
        "audit.view",
      ],
      user_count: 0,
    },
    {
      role_id: "role_viewer",
      app_id,
      name: "Viewer",
      description: "Read-only access to the app console.",
      is_system: false,
      permissions: ALL_PERMISSIONS.filter((p) => p.endsWith(".view")),
      user_count: 0,
    },
  ];

  const users: IAppUser[] = [
    ["Emeka", "Kezie", "emeka@ginimeg.com", "role_owner", "active", 3],
    ["Adaeze", "Okafor", "adaeze@ginimeg.com", "role_admin", "active", 95],
    ["Tunde", "Bakare", "tunde@ginimeg.com", "role_support", "active", 1440],
    ["Chioma", "Eze", "chioma@ginimeg.com", "role_viewer", "suspended", 20160],
    ["Ibrahim", "Musa", "ibrahim@ginimeg.com", "role_support", "invited", null],
  ].map(([firstname, lastname, email, role_id, status, lastMins], i) => ({
    user_id: `usr_${i + 1}`,
    app_id,
    firstname: firstname as string,
    lastname: lastname as string,
    email: email as string,
    role_id: role_id as string,
    status: status as IAppUser["status"],
    last_active: lastMins === null ? null : ago(lastMins as number),
    invited_by: "Emeka Kezie",
    created_date: ago(60 * 24 * (40 - i * 6)),
  }));

  const templates: IEmailTemplate[] = [
    {
      key: "welcome",
      name: "Welcome email",
      subject: "Welcome to {{app_name}}, {{firstname}}!",
      variables: ["firstname", "app_name", "login_url"],
    },
    {
      key: "verify_email",
      name: "Email verification (OTP)",
      subject: "Your {{app_name}} verification code",
      variables: ["firstname", "otp_code", "expires_in"],
    },
    {
      key: "password_reset",
      name: "Password reset",
      subject: "Reset your {{app_name}} password",
      variables: ["firstname", "reset_url", "expires_in"],
    },
    {
      key: "user_invite",
      name: "Admin invitation",
      subject: "You've been invited to manage {{app_name}}",
      variables: ["inviter_name", "app_name", "role_name", "accept_url"],
    },
    {
      key: "license_expiring",
      name: "License expiring",
      subject: "Your {{app_name}} license expires in {{days_left}} days",
      variables: ["app_name", "days_left", "expiry_date"],
    },
  ].map((t, i) => ({
    ...t,
    template_id: `tpl_${i + 1}`,
    app_id,
    body_html: `<p>Hi {{${t.variables[0]}}},</p><p>This is the <strong>${t.name.toLowerCase()}</strong> sent by {{app_name}}.</p><p>— The Ginimeg Team</p>`,
    smtp_id: null,
    is_active: i !== 4,
    updated_date: ago(60 * 24 * (i * 3 + 1)),
  }));

  const logSeed: [string, string, TAuditCategory, string, string?][] = [
    ["Emeka Kezie", "emeka@ginimeg.com", "license", "Generated license", "permanent"],
    ["Adaeze Okafor", "adaeze@ginimeg.com", "users", "Invited user", "ibrahim@ginimeg.com"],
    ["Adaeze Okafor", "adaeze@ginimeg.com", "smtp", "Sent test email", "Primary (Zoho)"],
    ["Emeka Kezie", "emeka@ginimeg.com", "roles", "Updated permissions", "Support"],
    ["Tunde Bakare", "tunde@ginimeg.com", "auth", "Signed in"],
    ["Emeka Kezie", "emeka@ginimeg.com", "users", "Suspended user", "chioma@ginimeg.com"],
    ["Adaeze Okafor", "adaeze@ginimeg.com", "smtp", "Updated SMTP", "Notifications (SendGrid)"],
    ["Emeka Kezie", "emeka@ginimeg.com", "settings", "Added authorized URL", "https://app.ginimeg.com"],
    ["Emeka Kezie", "emeka@ginimeg.com", "license", "Rotated API key"],
    ["Adaeze Okafor", "adaeze@ginimeg.com", "auth", "Signed in"],
    ["Emeka Kezie", "emeka@ginimeg.com", "roles", "Created role", "Viewer"],
    ["Tunde Bakare", "tunde@ginimeg.com", "auth", "Failed sign-in attempt"],
  ];
  const logs: IAuditLog[] = Array.from({ length: 36 }, (_, i) => {
    const [actor_name, actor_email, category, action, target] =
      logSeed[i % logSeed.length];
    return {
      log_id: `log_${i + 1}`,
      app_id,
      actor_name,
      actor_email,
      category,
      action,
      target,
      ip_address: `102.89.${(i * 7) % 255}.${(i * 13) % 255}`,
      created_date: ago(i * 173 + 4),
    };
  });

  return { users, roles, templates, logs };
};

export const getMockStore = (app_id: string): IAppStore => {
  if (!stores[app_id]) stores[app_id] = seed(app_id);
  const store = stores[app_id];
  // keep role user counts in sync with the users list
  store.roles.forEach((r) => {
    r.user_count = store.users.filter((u) => u.role_id === r.role_id).length;
  });
  return store;
};

export const addMockLog = (
  app_id: string,
  category: TAuditCategory,
  action: string,
  target?: string,
) => {
  getMockStore(app_id).logs.unshift({
    log_id: mockId("log"),
    app_id,
    actor_name: "You",
    actor_email: "",
    category,
    action,
    target,
    ip_address: "127.0.0.1",
    created_date: new Date().toISOString(),
  });
};
