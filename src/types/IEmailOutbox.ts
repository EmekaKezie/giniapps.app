/** From the delivery report: queued = not sent yet, sent = accepted by the SMTP server, delivered = confirmed delivered, failed = send failed */
export type TEmailOutboxStatus = "queued" | "sent" | "delivered" | "failed";

export interface IEmailDeliveryReport {
  dlr_id: string;
  status: TEmailOutboxStatus | string;
  error_message?: string | null;
  reported_date: string;
}

/** One row of GiniSend's email outbox, via `GET /app/:app_id/email_outbox`. */
export interface IEmailOutbox {
  message_id: string;
  /** Delivery status, from the delivery report. */
  status: TEmailOutboxStatus | string;
  /** Outbox queue state: queued = waiting to be sent, processed = send attempted. */
  queue_status?: "queued" | "processed" | string;
  recipient: string;
  /** From address used when sending (the SMTP's sender email at send time). */
  sender?: string | null;
  subject?: string | null;
  message_body?: string | null;
  error_message?: string | null;
  sent_date?: string | null;
  created_date: string;
  /** SMTP the email went through; null if that SMTP was later deleted. */
  smtp?: { smtp_id?: string; smtp_name: string; host: string } | null;
  delivery_report?: IEmailDeliveryReport | null;
}
