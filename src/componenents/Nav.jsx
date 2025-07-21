import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Stack,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Button,
  Popover,
  Badge
} from '@mui/material';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useUnreadMessages } from '../context/unreadMessageContext';
import NotificationList from '../pages/notificationList';
import Notification from '../FireBase/MessageAndNotification/Notification';
import { auth } from '../FireBase/firebaseConfig';

export default function Nav({ toggleMode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const currentId = auth.currentUser?.uid;
  const { totalUnreadCount } = useUnreadMessages();

  useEffect(() => {
    if (currentId) {
      // الاشتراك في عدد الإشعارات غير المقروءة
      const unsubscribe = Notification.subscribeUnreadCount(currentId, (count) => {
        setUnreadCount(count);
      });
      return () => unsubscribe();
    }
  }, [currentId]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMessagesClick = () => {
    handleClose();
    navigate("/inbox");
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      sx={{
        bgcolor: "#6E00FE",
        boxShadow: "none",
        color: "#fff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            maxHeight: "64px",
            overflow: "hidden",
          }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "200px", width: "200px" }}
          />
        </Box>

        <Stack direction="row" spacing={4} sx={{ direction: "rtl" }}>
          <Typography variant="button" sx={{ cursor: "pointer", px: 4 }} onClick={() => navigate('/home')}>
            الصفحة الرئيسية
          </Typography>
          <Typography variant="button" sx={{ cursor: "pointer" }} onClick={() => navigate('/about')}>
            عن الموقع
          </Typography>
          <Typography variant="button" sx={{ cursor: "pointer" }} onClick={() => navigate('/profile')}>
            الصفحة الشخصية
          </Typography>
          <Typography variant="button" sx={{ cursor: "pointer" }} onClick={() => navigate('/contact')}>
            تواصل معنا
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="قائمة المفضل">
            <Button onClick={() => navigate('/favorite')} sx={{ color: '#fff' }}>
              <FavoriteIcon />
            </Button>
          </Tooltip>
          <Tooltip title="الرسائل">
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={handleMessagesClick}
            >
              <Badge
                badgeContent={totalUnreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    top: "0px",
                    right: "0px",
                    backgroundColor: "#d1d1d1ff",
                    color: "black",
                    fontWeight: "bold",
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    zIndex: "10000",
                  },
                }}
              >
                <EmailIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="الإشعارات">
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={handleClick}
            >
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    top: "0px",
                    right: "0px",
                    backgroundColor: "#d1d1d1ff",
                    color: "black",
                    fontWeight: "bold",
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    zIndex: "10000",
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="تبديل الثيم">
            <IconButton size="small" onClick={toggleMode}>
              <Brightness4Icon />
            </IconButton>
          </Tooltip>
          <Tooltip title="ملفك الشخصي">
            <IconButton size="small" sx={{ color: "#fff" }} onClick={() => navigate('#')}>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NotificationList userId={currentId} />
          </Popover>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}