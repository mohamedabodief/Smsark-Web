const { setGlobalOptions } = require("firebase-functions");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

setGlobalOptions({ maxInstances: 10 });

initializeApp();
const db = getFirestore();

// ✅ دالة إرسال إشعار عند وصول رسالة جديدة
exports.sendMessageNotification = onDocumentCreated("messages/{messageId}", async (event) => {
  const message = event.data.data();

  const senderId = message.sender_id;
  const receiverId = message.receiver_id;
  const content = message.content || "لديك رسالة جديدة";

  try {
    // جلب بيانات المستخدم المستلم
    const recipientDoc = await db.collection("users").doc(receiverId).get();

    if (!recipientDoc.exists) {
      console.log(`⚠️ المستلم ${receiverId} غير موجود في قاعدة البيانات.`);
      return;
    }

    const fcmToken = recipientDoc.data().fcm_token;

    if (!fcmToken) {
      console.log(`⚠️ المستخدم ${receiverId} لا يمتلك FCM Token.`);
      return;
    }

    const payload = {
      notification: {
        title: "رسالة جديدة",
        body: content,
        sound: "default",
      },
      data: {
        senderId,
        type: "message",
      },
      token: fcmToken,
    };

    // إرسال الإشعار
    await getMessaging().send(payload);
    console.log(`✅ تم إرسال إشعار إلى المستخدم ${receiverId}`);

  } catch (error) {
    console.error("❌ خطأ أثناء إرسال الإشعار:", error);
  }
});
