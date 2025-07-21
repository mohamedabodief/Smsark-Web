import React, { useEffect, useState } from 'react';
import Notification from '../FireBase/MessageAndNotification/Notification';
const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = Notification.subscribeByUser(userId, (notifs) => {
      setNotifications(notifs);
    });
    return () => unsubscribe();
  }, [userId]);
  const handleMarkAsRead = async (notificationId) => {
    await Notification.markAsRead(notificationId);
  };

  return (
    <div className='p-2'>
      <h4 className='text-center mb-4'>الاشعارات</h4>
      {notifications.length === 0 ? (
        <p className='text-center text-danger mt-3'>لا توجد إشعارات</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              style={{ opacity: notif.is_read ? 0.5 : 1 }}
              onClick={() => handleMarkAsRead(notif.id)}
              
            >
              <strong>{notif.title}</strong>
              <p>{notif.body}</p>
              {notif.link && <a href={notif.link}>فتح</a>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;