// // src/FireBase/authService/sendResetPasswordEmail.js
// import { auth } from '../firebaseConfig';
// import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from 'firebase/auth';

// export default async function sendResetPasswordEmail(email) {
//   try {
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return { success: false, error: 'البريد الإلكتروني غير صالح' };
//     }

//     // التحقق من وجود المستخدم أولاً
//     const methods = await fetchSignInMethodsForEmail(auth, email);
//     if (methods.length === 0) {
//       return { success: false, error: 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني' };
//     }

//     await sendPasswordResetEmail(auth, email);
//     return {
//       success: true,
//       message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد أو spam.',
//     };
//   } catch (error) {
//     let errorMessage = 'حدث خطأ أثناء إرسال رابط الاستعادة';
//     switch (error.code) {
//       case 'auth/invalid-email':
//         errorMessage = 'البريد الإلكتروني غير صالح';
//         break;
//       case 'auth/too-many-requests':
//         errorMessage = 'تم تجاوز عدد المحاولات المسموح بها، يرجى المحاولة لاحقًا';
//         break;
//       default:
//         errorMessage = error.message || 'حدث خطأ غير متوقع';
//     }
//     return { success: false, error: errorMessage };
//   }
// }



import { auth } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export default async function sendResetPasswordEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.',
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}