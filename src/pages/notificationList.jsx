import React, { useEffect, useState } from 'react';
import Notification from '../FireBase/MessageAndNotification/Notification';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Card, CardContent } from '@mui/material';

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

  return (
    <div className='p-3'>
      <h4 className='text-center mb-4'>الإشعارات</h4>
      {notifications.length === 0 ? (
        <p className='text-center text-danger mt-3'>لا توجد إشعارات</p>
      ) : (
        <div className='d-flex flex-column gap-3'>
          {notifications.map((notif) => (
            <Card
  key={notif.id}
  className={`shadow-sm ${notif.is_read ? 'bg-light text-muted' : 'bg-warning-subtle border border-warning'}`}
  style={{ cursor: notif.link ? 'pointer' : 'default', transition: '0.3s' }}
  onClick={() => {
    handleMarkAsRead(notif.id);
    if (notif.link) {
      window.location.href = notif.link;
    }
  }}
>
  <CardContent className='d-flex justify-content-between align-items-start'>
    <div className='text-center'>
      <h6 className='mb-3 fw-bold'>{notif.title}</h6>
      <p className='mb-2' style={{ fontSize: '14px' }}>{notif.body}</p>
    </div>
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        handleDeleteNotification(notif.id);
      }}
      className='btn btn-sm text-danger'
      title='حذف'
    >
      <CloseIcon fontSize='small' />
    </button>
  </CardContent>
</Card>

          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
