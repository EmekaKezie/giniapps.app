import React, { useState } from "react";
import {
  Box,
  IconButton,
  alpha,
  useTheme,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Add as AddIcon,
  DescriptionOutlined,
  ReceiptOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";

type TProps = {
  smallScreen: boolean;
};

export default function QuickCreate({ smallScreen }: TProps) {
  const theme = useTheme();
  const [createAnchorEl, setCreateAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const handleOpenCreate = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCreateAnchorEl(event.currentTarget);
  };
  const handleCloseCreate = () => setCreateAnchorEl(null);

  return (
    <Box sx={{ ml: smallScreen ? 0 : 1 }}>
      {smallScreen ? (
        // Small Screen: Just the icon button
        <IconButton
          onClick={handleOpenCreate}
          color="primary"
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.2) },
          }}>
          <AddIcon />
        </IconButton>
      ) : (
        // Large Screen: Button with "New" text
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disableElevation
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            py: 1,
            //boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}>
          New
        </Button>
      )}

      {/* SHARED CREATE MENU */}
      <Menu
        anchorEl={createAnchorEl}
        open={Boolean(createAnchorEl)}
        onClose={handleCloseCreate}
        slotProps={{
          paper: {
            sx: {
              width: 200,
              mt: 1.5,
              borderRadius: 3,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}>
        <MenuItem onClick={handleCloseCreate} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <DescriptionOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Invoice"
            primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
          />
        </MenuItem>
        <MenuItem onClick={handleCloseCreate} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <ReceiptOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Invoice Item"
            primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
          />
        </MenuItem>
        <MenuItem onClick={handleCloseCreate} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <PersonAddOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Client"
            primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
          />
        </MenuItem>
      </Menu>
    </Box>
  );
}
