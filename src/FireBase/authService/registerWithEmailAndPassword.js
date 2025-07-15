// src/auth/registerWithEmailAndPassword.js

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { requestForToken } from '../MessageAndNotification/firebaseMessaging';
import User from '../modelsWithOperations/User'; // تأكد من صحة المسار

/**
 * تسجيل مستخدم جديد وحفظ FCM Token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, uid?: string, user?: object, error?: string}>}
 */
export default async function registerWithEmailAndPassword(email, password) {
  try {
    // ✅ إنشاء مستخدم جديد
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // ✅ إنشاء كائن مستخدم جديد داخل Firestore لو ما كانش موجود
    const newUser = new User({
      uid,
      type_of_user: 'client', // 👈 عدّل حسب نوع المستخدم
      phone: null,
      cli_name: null,
      // أضف باقي الحقول حسب الحاجة
    });

    await newUser.saveToFirestore();

    // ✅ توليد FCM Token
    const fcmToken = await requestForToken();

    // ✅ حفظ التوكن
    if (fcmToken) {
      await newUser.saveFcmToken(fcmToken);
    } else {
      console.warn('⚠️ لم يتم توليد FCM Token أثناء التسجيل.');
    }

    return {
      success: true,
      uid,
      user: userCredential.user,
    };
  } catch (error) {
    console.error('❌ خطأ أثناء إنشاء المستخدم:', error);
    return { success: false, error: error.message };
  }
}
