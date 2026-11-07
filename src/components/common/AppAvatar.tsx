import { Avatar } from "@mui/material";
import { useState } from "react";
import { colorFromString } from "@core/helper/format";

type TProps = {
  name?: string;
  /** Logo URL, data URI, or raw base64. Falls back to the initial if empty or broken. */
  logo?: string | null;
  size?: number;
};

const toSrc = (logo?: string | null) => {
  const v = logo?.trim();
  if (!v) return undefined;
  if (/^(https?:|data:|blob:|\/)/i.test(v)) return v;
  return `data:image/png;base64,${v}`; // raw base64 from the API
};

export default function AppAvatar({ name = "", logo, size = 40 }: TProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const candidate = toSrc(logo);
  const src = candidate && candidate !== failedSrc ? candidate : undefined;

  return (
    <Avatar
      variant="rounded"
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        borderRadius: size > 40 ? 2.5 : 1.5,
        // white backing so transparent logos stay readable in dark mode
        bgcolor: src ? "#fff" : colorFromString(name || "?"),
        border: src ? "1px solid" : "none",
        borderColor: "divider",
        color: "#fff",
        fontWeight: 800,
        fontSize: size * 0.42,
        flexShrink: 0,
        "& img": { objectFit: "contain", p: size > 40 ? 0.75 : 0.25 },
      }}
      slotProps={{ img: { loading: "lazy", onError: () => setFailedSrc(candidate) } }}>
      {name.charAt(0).toUpperCase() || "?"}
    </Avatar>
  );
}
