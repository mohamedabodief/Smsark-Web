import React, { useEffect, useState } from 'react';
import Notification from '../FireBase/MessageAndNotification/Notification';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Card, CardContent, IconButton, Tooltip, Box, Typography, Stack, Divider } from '@mui/material';

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = Notification.subscribeByUser(userId, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await Notification.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await Notification.delete(notificationId);
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => Notification.markAsRead(n.id)));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await Promise.all(notifications.map(n => Notification.delete(n.id)));
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  return (
    <Box p={2}>
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
        <Stack spacing={1}>
          {notifications.map((notif, index) => (
            <Card
              key={index}
              className={`${notif.is_read ? 'bg-light text-muted' : 'bg-warning-subtle border border-warning'}`}
              sx={{
                p: 1,
                minHeight: '90px',
                height: '90px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                transition: 'none',
                cursor: notif.link ? 'pointer' : 'default',
                position: 'relative',
                boxSizing: 'border-box',
              }}
              onClick={() => {
                handleMarkAsRead(notif.id);
                if (notif.link) {
                  window.location.href = notif.link;
                }
              }}
            >
              <CardContent sx={{ p: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{notif.title}</Typography>
                    <Typography variant="body2" fontSize={13}>{notif.body}</Typography>
                  </Box>
                  <Stack direction="column" spacing={1} ml={1}>
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
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default NotificationList;
