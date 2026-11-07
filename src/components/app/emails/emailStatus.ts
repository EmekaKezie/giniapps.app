type TChipColor = "success" | "info" | "warning" | "error" | "default";

const STATUS: Record<string, { label: string; color: TChipColor }> = {
  queued: { label: "Queued", color: "warning" },
  sent: { label: "Sent", color: "info" },
  delivered: { label: "Delivered", color: "success" },
  failed: { label: "Failed", color: "error" },
  // older emails
  pending: { label: "Queued", color: "warning" },
};

/** Values the outbox status filter accepts (same as GiniSend). */
export const EMAIL_STATUS_OPTIONS = ["queued", "sent", "delivered", "failed"];

export const emailStatus = (status?: string | null) =>
  STATUS[status?.toLowerCase() ?? ""] ?? {
    label: status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown",
    color: "default" as TChipColor,
  };

const looksLikeHtml = (body: string) => /<\/?[a-z][\s\S]*>/i.test(body);

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Wraps an email body for a sandboxed iframe. Links open in a new tab;
 * plain-text bodies keep their line breaks.
 */
export const buildPreviewDoc = (body: string) => {
  const content = looksLikeHtml(body)
    ? body
    : `<pre style="white-space:pre-wrap;font:14px/1.6 Roboto,Arial,sans-serif;margin:0">${escapeHtml(body)}</pre>`;
  // A full HTML document from the sender is used as-is (plus <base>), otherwise wrap it.
  if (/<html[\s>]/i.test(content)) {
    return content.replace(/<head(\s[^>]*)?>/i, (m) => `${m}<base target="_blank">`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"></head><body style="margin:16px;font-family:Roboto,Arial,sans-serif;color:#1f1f1f;background:#fff">${content}</body></html>`;
};
