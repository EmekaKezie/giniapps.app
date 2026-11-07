// MOCK: replace with real endpoint (`${api}/app/:app_id/audit_logs`) when ready.
// The real API should paginate server-side; `total` carries the full count.
import type { IAuditLog } from "@appTypes/IAuditLog";
import { getMockStore, mockResponse } from "./mock/mockDb";

export const apiGetAuditLogs = async (app_id: string) =>
  mockResponse<IAuditLog[]>([...getMockStore(app_id).logs]);
