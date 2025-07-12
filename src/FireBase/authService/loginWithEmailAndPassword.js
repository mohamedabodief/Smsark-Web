import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import requestForToken from '../MessageAndNotification/firebaseMessaging';
import User from '../models/User'; // تأكد من المسار

export default async function loginWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = userCredential.user.uid;

    // ✅ جلب التوكن من FCM
    const fcmToken = await requestForToken();

    // ✅ حفظ التوكن داخل مستند المستخدم
    if (fcmToken) {
      const userInstance = await User.getByUid(uid);
      if (userInstance) {
        await userInstance.saveFcmToken(fcmToken);
      }
    }

    return {
      success: true,
      uid: uid,
      user: userCredential.user,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
