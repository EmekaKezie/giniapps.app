// MOCK: replace each function body with a real fetch to `${api}/app/:app_id/users...`
// once the endpoints exist. Keep the signatures and IApiRes return shape.
import type { IAppUser, IInviteAppUserRequest } from "@appTypes/IAppUser";
import { addMockLog, getMockStore, mockId, mockResponse } from "./mock/mockDb";

export const apiGetAppUsers = async (app_id: string) =>
  mockResponse<IAppUser[]>([...getMockStore(app_id).users]);

export const apiInviteAppUser = async (
  app_id: string,
  param: IInviteAppUserRequest,
) => {
  const store = getMockStore(app_id);
  const [first] = param.email.split("@");
  const user: IAppUser = {
    user_id: mockId("usr"),
    app_id,
    firstname: first.charAt(0).toUpperCase() + first.slice(1),
    lastname: "",
    email: param.email,
    role_id: param.role_id,
    status: "invited",
    last_active: null,
    invited_by: "You",
    created_date: new Date().toISOString(),
  };
  store.users.push(user);
  addMockLog(app_id, "users", "Invited user", param.email);
  return mockResponse(user, "Invitation sent");
};

export const apiUpdateAppUser = async (
  app_id: string,
  user_id: string,
  param: Partial<Pick<IAppUser, "role_id" | "status">>,
) => {
  const store = getMockStore(app_id);
  const user = store.users.find((u) => u.user_id === user_id);
  if (user) Object.assign(user, param);
  addMockLog(app_id, "users", "Updated user", user?.email);
  return mockResponse(user ?? null, "User updated");
};

export const apiRemoveAppUser = async (app_id: string, user_id: string) => {
  const store = getMockStore(app_id);
  const user = store.users.find((u) => u.user_id === user_id);
  store.users = store.users.filter((u) => u.user_id !== user_id);
  addMockLog(app_id, "users", "Removed user", user?.email);
  return mockResponse(user_id, "User removed");
};
