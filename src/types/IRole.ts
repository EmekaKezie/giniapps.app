export interface IPermission {
  key: string; // e.g. "users.create"
  label: string;
}

export interface IPermissionModule {
  module: string; // e.g. "users"
  label: string;
  permissions: IPermission[];
}

export interface IRole {
  role_id: string;
  app_id: string;
  name: string;
  description: string;
  is_system: boolean; // system roles cannot be renamed or deleted
  permissions: string[]; // permission keys
  user_count: number;
}

export interface ICreateRoleRequest {
  name: string;
  description: string;
  copy_from_role_id?: string;
}
