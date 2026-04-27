import { useEffect } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Cancel, CheckCircle } from "@mui/icons-material";

type TProps = {
  password: string;
  onSuccess: (isValid: boolean) => void;
};

export default function PasswordRule({ password, onSuccess }: TProps) {
  const rules = [
    {
      label: "At least one uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "At least one special character",
      test: (pw: string) => /[!@#$%^&*(),.?":{}|<>_]/.test(pw),
    },
    {
      label: "At least one digit",
      test: (pw: string) => /\d/.test(pw),
    },
    {
      label: "Minimum 8 characters",
      test: (pw: string) => pw.length >= 8,
    },
  ];

  // 2. Calculate if ALL rules pass
  const allRulesPassed = rules.every((rule) => rule.test(password || ""));

  // 3. Trigger onSuccess only when the validity changes
  useEffect(() => {
    onSuccess(allRulesPassed);
  }, [allRulesPassed, onSuccess]);

  return (
    <List dense disablePadding>
      {rules.map((rule, index) => {
        const passes = rule.test(password || "");

        return (
          <ListItem key={index} disableGutters disablePadding>
            <ListItemIcon>
              {passes ? (
                <CheckCircle color="success" fontSize="small" />
              ) : (
                <Cancel color="error" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={rule.label}
              sx={{ color: passes ? "success.main" : "text.secondary", ml: -4 }}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
