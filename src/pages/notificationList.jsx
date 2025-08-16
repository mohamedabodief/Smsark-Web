import React, { useEffect, useState, useRef, memo } from 'react';
import Notification from '../FireBase/MessageAndNotification/Notification';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Card, CardContent, IconButton, Tooltip, Box, Typography, Stack } from '@mui/material';

const NotificationCard = memo(
  ({ notif, handleMarkAsRead, handleDeleteNotification }) => (
    <Card
      className="notification-card"
      sx={{
        p: 1,
        height: '90px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        transition: 'none',
        cursor: notif.link ? 'pointer' : 'default',
        position: 'relative',
        boxSizing: 'border-box',
        border: '1px solid',
        borderColor: notif.is_read ? 'transparent' : '#ffca28',
        backgroundColor: notif.is_read ? '#f8f9fa' : '#fff3cd',
        color: notif.is_read ? '#6c757d' : 'inherit',
        
      }}
      onClick={() => {
        if (notif.link) {
          handleMarkAsRead(notif.id);
          window.location.href = notif.link;
        } else {
          handleMarkAsRead(notif.id);
        }
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Stack direction="row" display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="bold">{notif.title}</Typography>
            <Typography variant="body2" fontSize={13}>{notif.body}</Typography>
          </Box>
          <Stack direction="column" spacing={1} ml={6}>
            <Tooltip title="تحديد كمقروء">
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(notif.id);
                }}
              >
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="حذف">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(notif.id);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.notif.id === nextProps.notif.id &&
      prevProps.notif.is_read === nextProps.notif.is_read &&
      prevProps.notif.title === nextProps.notif.title &&
      prevProps.notif.body === nextProps.notif.body &&
      prevProps.notif.link === nextProps.notif.link
    );
  }
);

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const scrollRef = useRef(null);

  const saveScrollPosition = () => {
    if (scrollRef.current) {
      return scrollRef.current.scrollTop;
    }
    return 0;
  };

  const restoreScrollPosition = (scrollPosition) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  };

  useEffect(() => {
    const unsubscribe = Notification.subscribeByUser(userId, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    const scrollPosition = saveScrollPosition();
    try {
      await Notification.markAsRead(notificationId);
      restoreScrollPosition(scrollPosition);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    const scrollPosition = saveScrollPosition();
    try {
      await Notification.delete(notificationId);
      restoreScrollPosition(scrollPosition);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    const scrollPosition = saveScrollPosition();
    try {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => Notification.markAsRead(n.id)));
      restoreScrollPosition(scrollPosition);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    const scrollPosition = saveScrollPosition();
    try {
      await Promise.all(notifications.map(n => Notification.delete(n.id)));
      restoreScrollPosition(scrollPosition);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  return (
    <Box
      ref={scrollRef}
      p={2}
      sx={{
        position: 'fixed',
        right: '80px',
        width: '300px',
        maxHeight: '80vh', 
        overflowY: 'auto',
        scrollBehavior: 'auto',
        overscrollBehavior: 'contain',
        transition: 'none',
        zIndex: 1400,
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius:'6px'
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>الإشعارات</Typography>

      {notifications.length > 0 && (
        <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
          <Tooltip title="تحديد الكل كمقروء">
            <IconButton color="primary" onClick={handleMarkAllAsRead}>
              <DoneAllIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="حذف الكل">
            <IconButton color="error" onClick={handleDeleteAll}>
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      {notifications.length === 0 ? (
        <Typography align="center" color="error">لا توجد إشعارات</Typography>
      ) : (
        <Stack spacing={1} sx={{ transition: 'none' }}>
          {notifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notif={notif}
              handleMarkAsRead={handleMarkAsRead}
              handleDeleteNotification={handleDeleteNotification}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default NotificationList;