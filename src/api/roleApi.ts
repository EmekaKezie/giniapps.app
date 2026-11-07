// MOCK: replace with real endpoints (`${api}/app/:app_id/roles...`) when ready.
import type {
  ICreateRoleRequest,
  IPermissionModule,
  IRole,
} from "@appTypes/IRole";
import {
  addMockLog,
  getMockStore,
  mockId,
  mockResponse,
  PERMISSION_MODULES,
} from "./mock/mockDb";

export const apiGetPermissionModules = async () =>
  mockResponse<IPermissionModule[]>(PERMISSION_MODULES, "Successful", 150);

export const apiGetRoles = async (app_id: string) =>
  mockResponse<IRole[]>(
    getMockStore(app_id).roles.map((r) => ({
      ...r,
      permissions: [...r.permissions],
    })),
  );

export const apiCreateRole = async (
  app_id: string,
  param: ICreateRoleRequest,
) => {
  const store = getMockStore(app_id);
  const source = store.roles.find((r) => r.role_id === param.copy_from_role_id);
  const role: IRole = {
    role_id: mockId("role"),
    app_id,
    name: param.name,
    description: param.description,
    is_system: false,
    permissions: source ? [...source.permissions] : [],
    user_count: 0,
  };
  store.roles.push(role);
  addMockLog(app_id, "roles", "Created role", role.name);
  return mockResponse(role, "Role created");
};

export const apiUpdateRolePermissions = async (
  app_id: string,
  role_id: string,
  permissions: string[],
) => {
  const role = getMockStore(app_id).roles.find((r) => r.role_id === role_id);
  if (role) role.permissions = [...permissions];
  addMockLog(app_id, "roles", "Updated permissions", role?.name);
  return mockResponse(role_id, "Permissions saved");
};

export const apiDeleteRole = async (app_id: string, role_id: string) => {
  const store = getMockStore(app_id);
  const role = store.roles.find((r) => r.role_id === role_id);
  store.roles = store.roles.filter((r) => r.role_id !== role_id);
  addMockLog(app_id, "roles", "Deleted role", role?.name);
  return mockResponse(role_id, "Role deleted");
};
