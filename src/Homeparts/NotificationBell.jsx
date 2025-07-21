import { useEffect, useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Notification from '../FireBase/MessageAndNotification/Notification';
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.auth.user);

  // ✅ الاشتراك لحظياً في جميع إشعارات المستخدم 
  useEffect(() => {
    if (user?.id) {
      const unsubscribe = Notification.subscribeByUser(user.id, (newNotifications) => {
        setNotifications(newNotifications);
        console.log('🔔 إشعارات لحظية:', newNotifications);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // ✅ الاشتراك في عدد الإشعارات غير المقروءة فقط
  useEffect(() => {
    if (user?.id) {
      const unsubscribe = Notification.subscribeUnreadCount(user.id, (count) => {
        setUnreadCount(count);
        console.log('🔄 عدد الإشعارات غير المقروءة:', count);
      });
      return () => unsubscribe();
    }
  }, [user]);
  
  const handleOpen = async (event) => {
  setAnchorEl(event.currentTarget);

  if (!user?.id) {
    console.warn("❗ لا يوجد مستخدم حالياً");
    return;
  }

  await Notification.markAllAsRead(user.id); // ✅ تعليم الكل كمقروء
  setUnreadCount(0);
};

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="الإشعارات">
        <IconButton sx={{ color: 'white' }} onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 1 }}
      >
        <div style={{ width: 300, maxHeight: 400, overflowY: 'auto', padding: 10 }}>
          <h4 style={{ margin: '0 0 10px 0' }}>الإشعارات</h4>
          {notifications.length === 0 && <p>لا توجد إشعارات.</p>}
          {notifications.map((noti) => (
            <div key={noti.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <strong>{noti.title}</strong>
              <p style={{ margin: 0, fontSize: 13 }}>{noti.body}</p>
              <small style={{ color: 'gray' }}>
                {new Date(noti.timestamp?.seconds * 1000).toLocaleString('ar-EG')}
              </small>
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default NotificationBell;
