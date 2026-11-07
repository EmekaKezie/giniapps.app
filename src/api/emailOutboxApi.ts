import { AUTH_TOKEN } from "@core/storage/authstorage";
import { api } from "./api";

export interface IEmailOutboxFilter {
  /** Partial, case-insensitive match on the recipient address. */
  recipient?: string;
  /** queued | sent | delivered | failed (from the delivery report) */
  status?: string;
  /** Only emails sent through this SMTP. */
  smtp_id?: string;
  /** ISO datetimes, inclusive, on the email's created date. */
  from?: string;
  to?: string;
}

/** Emails this app has sent through GiniSend, newest first. `total` is the filtered count. */
export const apiGetEmailOutbox = async (
  app_id: string,
  offset = 0,
  limit = 20,
  filter: IEmailOutboxFilter = {},
) => {
  try {
    const query = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
    });
    if (filter.recipient) query.set("recipient", filter.recipient);
    if (filter.status) query.set("status", filter.status);
    if (filter.smtp_id) query.set("smtp_id", filter.smtp_id);
    if (filter.from) query.set("from", filter.from);
    if (filter.to) query.set("to", filter.to);

    const url = `${api}/app/${app_id}/email_outbox?${query}`;
    const response = await fetch(url, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN()}`,
      },
    });
    return response.json();
  } catch (error) {
    return error;
  }
};
