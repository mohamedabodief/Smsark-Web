// src/auth/registerWithEmailAndPassword.js

import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { requestForToken } from "../MessageAndNotification/firebaseMessaging";
import User from '../modelsWithOperations/User'; // تأكد من صحة المسار


/**
 * تسجيل مستخدم جديد وحفظ FCM Token
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{success: boolean, uid?: string, user?: object, error?: string}>}
 */
export default async function registerWithEmailAndPassword(email, password) {
  try {

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: 'البريد الإلكتروني غير صالح' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }
    // ✅ إنشاء مستخدم جديد
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // ✅ توليد FCM Token (optional, can be moved to after profile completion if needed)
    const fcmToken = await requestForToken();
    // (Optional) Save FCM token somewhere if needed, but do not create Firestore user here

    return {
      success: true,
      uid,
      user: userCredential.user,
    };
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء التسجيل';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
        break;
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صالح';
        break;
      case 'auth/weak-password':
        errorMessage = 'كلمة المرور ضعيفة جدًا';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'عملية التسجيل غير مفعلة في إعدادات Firebase';
        break;
      default:
        errorMessage = error.message || 'حدث خطأ غير متوقع';
    }
    return { success: false, error: errorMessage };
  }
}
