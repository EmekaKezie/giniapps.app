// Change this import:
import ReactQuill from "react-quill-new";
// Change the CSS import too:
import "react-quill-new/dist/quill.snow.css";
import { Box, useTheme } from "@mui/material";

type TProps = {
  value: any;
  onChange: (content: any) => void;
  height?: number;
  placeholder?: string;
  bgcolor?: string;
};

export default function RichtextEditor({
  value,
  onChange,
  height,
  placeholder,
  bgcolor,
}: TProps) {
  const theme = useTheme();
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          "& .ql-container": {
            minHeight: !height ? "100px" : `${height}px`,
            fontSize: "1rem",
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            backgroundColor: bgcolor || theme.palette.background.paper,
          },
          "& .ql-toolbar": {
            //backgroundColor: "#f5f5f5",
            backgroundColor: theme.palette.grey[100],
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          },
          "& .ql-container.ql-snow": {
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
          },
        }}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Write a message"}
        />
      </Box>
    </Box>
  );
}
