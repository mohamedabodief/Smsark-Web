// src/utils/fcmHelper.js

import { requestForToken } from '../MessageAndNotification/firebaseMessaging';
import User from '../modelsWithOperations/User';
import { auth } from '../firebaseConfig';

// ✅ طلب صلاحية الإشعارات ثم حفظ التوكن في Firestore
export const requestPermissionAndSaveToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.warn('🚫 لم يتم منح صلاحية الإشعارات');
      return;
    }

    const token = await requestForToken();

    const user = auth.currentUser;
    if (token && user?.uid) {
      const userInstance = await User.getByUid(user.uid);
      if (userInstance) {
        await userInstance.saveFcmToken(token);
        console.log('✅ تم حفظ التوكن في حساب المستخدم');
      }
    }
  } catch (err) {
    console.error('❌ فشل طلب صلاحية الإشعارات أو حفظ التوكن:', err);
  }
};
