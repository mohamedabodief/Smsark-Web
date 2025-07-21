import React, { useEffect, useState } from 'react';
import Notification from '../FireBase/MessageAndNotification/Notification';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
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
      console.log('Notification marked as read:', notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    console.log('Attempting to delete notification:', notificationId);
    try {
      await Notification.delete(notificationId);
      console.log('Notification deleted successfully');
      setNotifications(notifications.filter((notif) => notif.id !== notificationId)); 
    } catch (error) {
      console.error('Error deleting notification:', error);
 _

    }
  };

  return (
    <div className='p-2'>
      <h4 className='text-center mb-4'>الإشعارات</h4>
      {notifications.length === 0 ? (
        <p className='text-center text-danger mt-3'>لا توجد إشعارات</p>
      ) : (
        <ul style={{ padding: 0, listStyle: 'none' }}>
          {notifications.map((notif, index) => (
            <li
              key={notif.id}
              style={{
                opacity: notif.is_read ? 0.5 : 1,
                padding: '10px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom:
                  index < notifications.length - 1
                    ? '1px solid #ccc'
                    : 'none', 
              }}
              onClick={() => handleMarkAsRead(notif.id)}
            >
              <div>
                <strong>{notif.title}</strong>
                <p style={{ margin: '5px 0 0 0' }}>{notif.body}</p>
              </div>
              {notif.link && (
                <div>
                  <a
                    href={notif.link}
                    target='_self'
                    rel='noopener noreferrer'
                    style={{
                      margin: '0 10px',
                      textDecoration: 'none',
                      color: '#007bff',
                      fontSize: '16px',
                    }}
                    title='فتح'
                  >
                   <OpenInNewIcon/>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDeleteNotification(notif.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                    title='حذف'
                  >
                    <CloseIcon/>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;