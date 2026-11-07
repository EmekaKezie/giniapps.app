import { ScienceOutlined } from "@mui/icons-material";
import { Alert } from "@mui/material";

type TProps = {
  feature?: string;
};

/** Marks pages that run on sample data until their API is ready. */
export default function MockBanner({ feature = "This page" }: TProps) {
  return (
    <Alert
      severity="info"
      variant="outlined"
      icon={<ScienceOutlined fontSize="small" />}
      sx={{ mb: 3, borderRadius: 2, py: 0 }}>
      {feature} is a preview running on sample data. Changes are kept until you
      reload the page and are not saved to the server yet.
    </Alert>
  );
}
