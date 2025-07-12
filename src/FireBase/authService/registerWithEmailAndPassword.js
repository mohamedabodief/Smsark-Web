import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import requestForToken from '../MessageAndNotification/firebaseMessaging';
import User from '../models/User'; // تأكد من المسار

export default async function registerWithEmailAndPassword(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // ✅ توليد FCM Token
    const fcmToken = await requestForToken();

    // ✅ تخزين التوكن في مستند المستخدم
    if (fcmToken) {
      const userInstance = await User.getByUid(uid);
      if (userInstance) {
        await userInstance.saveFcmToken(fcmToken);
      }
    }

    return {
      success: true,
      uid,
      user: userCredential.user,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
