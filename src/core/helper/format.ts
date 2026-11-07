export const timeAgo = (iso?: string | null) => {
  if (!iso) return "Never";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Just now";
  const units: [number, string][] = [
    [60 * 60 * 24 * 365, "y"],
    [60 * 60 * 24 * 30, "mo"],
    [60 * 60 * 24 * 7, "w"],
    [60 * 60 * 24, "d"],
    [60 * 60, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) {
    if (diff >= secs) return `${Math.floor(diff / secs)}${label} ago`;
  }
  return "Just now";
};

export const formatDate = (iso?: string | null, withTime = false, withSeconds = false) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-NG", { dateStyle: "medium" });
  if (!withTime) return date;
  // 12-hour clock, e.g. "5 Sept 2026, 7:12 pm" (or "7:12:05 pm" with seconds)
  const time = d.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    ...(withSeconds && { second: "2-digit" }),
    hour12: true,
  });
  return `${date}, ${time}`;
};

/** Time only, 12-hour with seconds, e.g. "7:12:05 pm". */
export const formatTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
};

export const initials = (...parts: (string | null | undefined)[]) =>
  parts
    .filter(Boolean)
    .map((p) => p!.trim().charAt(0).toUpperCase())
    .join("")
    .slice(0, 2) || "?";

// Stable, muted avatar colours so each app/user is recognisable at a glance.
const AVATAR_COLORS = [
  "#4E5E75",
  "#3B6EA5",
  "#2E7D6B",
  "#7A5C99",
  "#A0613A",
  "#5B7F2E",
  "#9C3D54",
  "#386B7D",
];

export const colorFromString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};
