import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { userDataState } from "api-store/user-data/slice";
import User from "assets/User";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const TopAppBar = ({ logout }: any) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const { name } = useSelector(
    (state: { userData: userDataState }) => state.userData
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" id="topbar" sx={{ bgcolor: "transparent", boxShadow: "none", elevation: 0 }}>
      <Toolbar>
        <Box flexGrow={1} display={"flex"} alignItems={"center"}>
          <Typography
            variant="h6"
            noWrap
            color={theme.palette.error.main}
            fontWeight={"bolder"}
          >
            ResumeBot
          </Typography>
        </Box>
        <Box flexGrow={0} display={"flex"}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                border: "3px solid",
                borderColor: theme.palette.secondary.light,
              }}
            >
              <User color={theme.palette.secondary.light} />
            </Avatar>
          </IconButton>
          <Menu
            sx={{ minWidth: "800px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            keepMounted
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                bgcolor: theme.palette.common.white,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: theme.palette.common.white,
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              disableRipple
              sx={{ display: "flex", alignItems: "center" }}
            >
              <User />
              <Typography ml={1} fontWeight={"bold"}>
                {name}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout} sx={{ pt: 1 }}>
              <Logout />
              <Typography ml={1}>Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default TopAppBar;
