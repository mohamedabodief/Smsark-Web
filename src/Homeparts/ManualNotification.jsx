import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FirebaseNotification from '../FireBase/MessageAndNotification/Notification'; // ✅ غيّرنا الاسم لتجنب التعارض

const ManualNotification = () => {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // ✅ تأكدي إن الإذن للإشعارات موجود
    if ('Notification' in window && window.Notification.permission !== 'granted') {
      window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('✅ تم تفعيل الإشعارات من المستخدم');
        } else {
          console.warn('🚫 لم يتم تفعيل الإشعارات');
        }
      });
    }
  }, []);
  
  useEffect(() => {
    if (user?.id && window.Notification.permission === 'granted') {
      const unsubscribe = FirebaseNotification.subscribeToUserNotifications(user.id, (notifications) => {
        console.log('🔔 إشعار جديد:', notifications);

        if (notifications.length > 0) {
          const latest = notifications[0];
          new window.Notification(latest.title || '📢 إشعار جديد', {
            body: latest.body || '',
            icon: '/1.png',
          });
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSendNotification = () => {
    console.log('🔘 تم الضغط على الزر');
    if (window.Notification.permission === 'granted') {
      new window.Notification('📣 إشعار مباشر من الزر', {
        body: 'هذا إشعار ظهر من كود الجافاسكربت مباشرة!',
        icon: '/1.png',
      });
    } else {
      console.warn('❌ لم يتم منح صلاحية الإشعارات');
    }
  };

  return (
    <button onClick={handleSendNotification}>
      🔔 إرسال إشعار يدوي
    </button>
  );
};

export default ManualNotification;
