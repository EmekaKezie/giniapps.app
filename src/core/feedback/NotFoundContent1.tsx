import {
  Box,
  Typography,
  Card,
  CardActionArea,
  alpha,
  useTheme,
} from "@mui/material";
import {
  BusinessOutlined,
  DocumentScannerOutlined,
  ReceiptOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type TProps = {
  onCreateItem?: () => void;
};

export default function NotFoundContent1({ onCreateItem }: TProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  const ACTIONS = [
    {
      title: "Create Client",
      desc: `Create a client for your organisation. You will be required to select client when creating an invoice`,
      icon: <BusinessOutlined sx={{ fontSize: 28 }} />,
      featured: false,
      onClick: () => {
        navigate(`../client/create`);
      },
    },
    {
      title: "Create Invoice",
      desc: `Create an invoice. Invoice can be sent to clients through email. it can also be made to be recurrent`,
      icon: <ReceiptOutlined sx={{ fontSize: 28 }} />,
      featured: true,
      onClick: () => {
        navigate(`../templates`);
      },
    },
    {
      title: "Create Invoice item",
      desc: `Invoice items can be created independently. Items can be imported when creating an invoice `,
      icon: <DocumentScannerOutlined sx={{ fontSize: 28 }} />,
      featured: false,
      onClick: () => {
        onCreateItem && onCreateItem();
      },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        //flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        p: 3,
      }}>
      <Box>
        {/* Constraints the total width of the content so it stays "Together" */}
        <Box sx={{ width: "100%", maxWidth: "900px" }}>
          <Box
            component="img"
            src="https://res.cloudinary.com/ddae5tiwv/image/upload/v1773913539/empty_jxnnwq.png"
            sx={{
              width: "160px", // Shrunk slightly
              mb: 3,
              opacity: 0.9,
            }}
          />

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Hi Nnaemeka, we couldn't find any invoices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose an action below to get started.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: { md: "nowrap", xs: "wrap" },
              gap: 4,
            }}
            alignItems="center"
            justifyContent="center">
            {ACTIONS.map((action, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  width: "300px",
                  borderRadius: 5,
                  transition: "all 0.3s ease-in-out",
                  border: 1,
                  borderColor: "divider",
                  bgcolor: action.featured
                    ? alpha(theme.palette.grey[50], 2)
                    : "background.paper",
                  transform: {
                    md: action.featured ? "scale(1.05)" : "scale(1)",
                    xs: "scale(1)",
                  },
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "primary.main",
                    boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.2)}`,
                  },
                }}>
                <CardActionArea onClick={action.onClick} sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "12px",
                      bgcolor: action.featured
                        ? "primary.main"
                        : alpha(theme.palette.primary.main, 0.1),
                      color: action.featured ? "white" : "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      mx: "auto",
                    }}>
                    {action.icon}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 0.5 }}>
                    {action.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", px: 1 }}>
                    {action.desc}
                  </Typography>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
