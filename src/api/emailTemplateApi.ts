// MOCK: replace with real endpoints (`${api}/app/:app_id/templates...`) when ready.
import type {
  IEmailTemplate,
  ISaveEmailTemplateRequest,
} from "@appTypes/IEmailTemplate";
import { addMockLog, getMockStore, mockResponse } from "./mock/mockDb";

export const apiGetEmailTemplates = async (app_id: string) =>
  mockResponse<IEmailTemplate[]>(
    getMockStore(app_id).templates.map((t) => ({ ...t })),
  );

export const apiUpdateEmailTemplate = async (
  app_id: string,
  template_id: string,
  param: ISaveEmailTemplateRequest,
) => {
  const tpl = getMockStore(app_id).templates.find(
    (t) => t.template_id === template_id,
  );
  if (tpl)
    Object.assign(tpl, param, { updated_date: new Date().toISOString() });
  addMockLog(app_id, "settings", "Updated email template", tpl?.name);
  return mockResponse(tpl ?? null, "Template saved");
};
