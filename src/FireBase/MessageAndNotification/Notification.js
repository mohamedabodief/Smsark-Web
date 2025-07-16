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
  limit,
} from 'firebase/firestore';

import { db, timestamp } from '../firebaseConfig';

class Notification {
  constructor(data) {
    if (!data.receiver_id || !data.title || !data.body) {
      throw new Error('يجب أن يحتوي الإشعار على: receiver_id, title, body');
    }

    this.receiver_id = data.receiver_id;
    this.title = data.title;
    this.body = data.body;

    this.timestamp = data.timestamp || timestamp.now();
    this.is_read = data.is_read ?? false;
    this.type = data.type || 'general'; // مثل: alert | message | system
    this.link = data.link || null; // رابط داخلي أو توجيه لصفحة معينة
  }

  /**
   * إرسال إشعار جديد إلى Firestore
   */
  async send() {
    await addDoc(collection(db, 'notifications'), {
      receiver_id: this.receiver_id,
      title: this.title,
      body: this.body,
      timestamp: this.timestamp,
      is_read: this.is_read,
      type: this.type,
      link: this.link,
    });
  }

  /**
   * الاشتراك اللحظي في إشعارات مستخدم معيّن
   */
  static subscribeByUser(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(notifications);
    });
  }

  /**
   * جلب جميع إشعارات مستخدم
   */
  static async getByUserId(userId) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * جلب أحدث X إشعار لمستخدم
   */
  static async getLatestByUser(userId, limitNumber = 5) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitNumber)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * جلب الإشعارات غير المقروءة فقط
   */
  static async getUnreadNotifications(userId) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId),
      where('is_read', '==', false),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * عدّ عدد الإشعارات غير المقروءة
   */
  static async countUnreadNotifications(userId) {
    const unread = await Notification.getUnreadNotifications(userId);
    return unread.length;
  }

  /**
   * الاشتراك اللحظي في عدد الإشعارات غير المقروءة
   */
  static subscribeUnreadCount(userId, callback) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId),
      where('is_read', '==', false)
    );

    return onSnapshot(q, (snapshot) => {
      callback(snapshot.size); // العدد فقط
    });
  }

  /**
   * تعليم إشعار واحد كمقروء
   */
  static async markAsRead(notificationId) {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { is_read: true });
  }

  /**
   * تعليم كل الإشعارات الخاصة بالمستخدم كمقروءة
   */
  static async markAllAsRead(userId) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId),
      where('is_read', '==', false)
    );
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((docSnap) =>
      updateDoc(doc(db, 'notifications', docSnap.id), { is_read: true })
    );
    await Promise.all(updates);
  }

  /**
   * حذف إشعار واحد
   */
  static async delete(notificationId) {
    const docRef = doc(db, 'notifications', notificationId);
    await deleteDoc(docRef);
  }

  /**
   * حذف كل إشعارات مستخدم معيّن
   */
  static async deleteAllByUser(userId) {
    const q = query(
      collection(db, 'notifications'),
      where('receiver_id', '==', userId)
    );
    const snapshot = await getDocs(q);
    const deletions = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, 'notifications', docSnap.id))
    );
    await Promise.all(deletions);
  }
}

export default Notification;
