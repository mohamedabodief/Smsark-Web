import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import { db, timestamp } from '../firebaseConfig';

class Message {
  constructor(data) {
    if (!data.sender_id || !data.receiver_id || !data.content) {
      throw new Error(
        'الرسالة يجب أن تحتوي على: sender_id, receiver_id, content'
      );
    }

    this.sender_id = data.sender_id;
    this.receiver_id = data.receiver_id;
    this.content = data.content;
   this.reciverName = data.reciverName;
    this.timestamp = data.timestamp || timestamp.now();
    this.is_read = data.is_read ?? false;
    this.message_type = data.message_type || 'text';
    this.reply_to_message_id = data.reply_to_message_id || null;
  }

  /**
   * إرسال الرسالة إلى Firestore
   */
  async send() {
    await addDoc(collection(db, 'messages'), {
      sender_id: this.sender_id,
      receiver_id: this.receiver_id,
      content: this.content,
      timestamp: this.timestamp,
      is_read: this.is_read,
      message_type: this.message_type,
      reply_to_message_id: this.reply_to_message_id,
      reciverName: this.reciverName,
    });
  }

  /**
   * الاشتراك اللحظي في المحادثة بين مستخدمين
   */
  static subscribeToConversation(user1, user2, callback) {
    const messagesRef = collection(db, 'messages');

    const q = query(
      messagesRef,
      where('sender_id', 'in', [user1, user2]),
      where('receiver_id', 'in', [user1, user2]),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (msg) =>
            (msg.sender_id === user1 && msg.receiver_id === user2) ||
            (msg.sender_id === user2 && msg.receiver_id === user1)
        );

      callback(messages);
    });
  }

  /**
   * تعليم الرسالة بأنها "مقروءة"
   */
  static async markAsRead(messageId) {
    const docRef = doc(db, 'messages', messageId);
    await updateDoc(docRef, { is_read: true });
  }

  /**
   * حذف الرسالة
   */
  static async deleteMessage(messageId) {
    const docRef = doc(db, 'messages', messageId);
    await deleteDoc(docRef);
  }

  /**
   * جلب كل الرسائل بين طرفين بدون الاشتراك اللحظي
   */
   static async getConversation(user1, user2) {
    const messagesSent = query(
      collection(db, 'messages'),
      where('sender_id', '==', user1),
      where('receiver_id', '==', user2),
      orderBy('timestamp', 'asc')
    );

    const messagesReceived = query(
      collection(db, 'messages'),
      where('sender_id', '==', user2),
      where('receiver_id', '==', user1),
      orderBy('timestamp', 'asc')
    );

    const [sentSnapshot, receivedSnapshot] = await Promise.all([
      getDocs(messagesSent),
      getDocs(messagesReceived),
    ]);

    const sentMessages = sentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const receivedMessages = receivedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const allMessages = [...sentMessages, ...receivedMessages].sort(
      (a, b) => a.timestamp?.toMillis?.() - b.timestamp?.toMillis?.()
    );

    return allMessages;
  }
  ///
static async getAllMessagesForUser(userId) {
  const q = query(
    collection(db, "messages"),
    where("sender_id", "==", userId)
  );

  const q2 = query(
    collection(db, "messages"),
    where("receiver_id", "==", userId)
  );

  const [sentSnap, receivedSnap] = await Promise.all([
    getDocs(q),
    getDocs(q2),
  ]);

  const sentMessages = sentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const receivedMessages = receivedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return [...sentMessages, ...receivedMessages];
}


  /**
   * جلب كل الرسائل غير المقروءة لمستخدم
   */
  static async getUnreadMessages(userId) {
    const q = query(
      collection(db, 'messages'),
      where('receiver_id', '==', userId),
      where('is_read', '==', false),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  /**
   * عدّ الرسائل غير المقروءة
   */
  static async countUnreadMessages(userId) {
    const unread = await Message.getUnreadMessages(userId);
    return unread.length;
  }
}

export default Message;
