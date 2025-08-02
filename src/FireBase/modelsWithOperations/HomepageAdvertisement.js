import {
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { db, auth } from '../firebaseConfig';
import User from './User';
import Notification from '../MessageAndNotification/Notification';

class HomepageAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.image = data.image || null;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.receipt_image = data.receipt_image || null;
    this.reviewStatus = data.reviewStatus || 'pending'; // 'pending', 'approved', 'rejected'
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.userId = data.userId || null;
    this.createdAt = data.createdAt || null;
    // إضافة العنوان إذا كان موجودًا في البيانات
    this.title = data.title || '';
  }

  get id() {
    return this.#id;
  }

  // ✅ إنشاء إعلان جديد + رفع الصورة + إيصال الدفع + إشعار للأدمن
  async save(imageFile = null, receiptFile = null) {
    this.createdAt = Date.now();
    const colRef = collection(db, 'HomepageAdvertisements');
    // تأكد من وجود العنوان قبل الحفظ
    if (!this.title) {
      this.title = 'إعلان بدون عنوان';
    }
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    if (imageFile) {
      const imageUrl = await this.#uploadImage(imageFile);
      this.image = imageUrl;
      await updateDoc(docRef, { image: imageUrl });
    }

    if (receiptFile) {
      const receiptUrl = await this.#uploadReceipt(receiptFile);
      this.receipt_image = receiptUrl;
      await updateDoc(docRef, { receipt_image: receiptUrl });
    }

    const admins = await User.getAllUsersByType('admin');
    await Promise.all(
      admins.map((admin) =>
        new Notification({
          receiver_id: admin.uid,
          title: '📢 إعلان واجهة جديد بانتظار المراجعة',
          body: `تم إضافة إعلان جديد لواجهة الموقع.`,
          type: 'system',
          link: `/admin-dashboard`,
        }).send()
      )
    );

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان أو الصورة أو الإيصال
  async update(updates = {}, newImageFile = null, newReceiptFile = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID غير قابل للتحديث');
    const docRef = doc(db, 'HomepageAdvertisements', this.#id);

    if (newImageFile) {
      await this.#deleteImage();
      const newUrl = await this.#uploadImage(newImageFile);
      updates.image = newUrl;
      this.image = newUrl;
    }

    if (newReceiptFile) {
      await this.#deleteReceipt();
      const receiptUrl = await this.#uploadReceipt(newReceiptFile);
      updates.receipt_image = receiptUrl;
      this.receipt_image = receiptUrl;
    }

    await updateDoc(docRef, updates);
  }

  // ✅ حذف الإعلان وكل الصور المرتبطة به
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID غير قابل للحذف');
    await this.#deleteImage();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'HomepageAdvertisements', this.#id));
  }

  // ✅ الموافقة على الإعلان من قبل الأدمن
  async approve() {
    const admin = await User.getByUid(auth.currentUser.uid);
    await this.update({
      reviewStatus: 'approved',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });

    if (this.userId) {
      await new Notification({
        receiver_id: this.userId,
        title: '✅ تمت الموافقة على إعلانك الواجهة',
        body: 'سيتم عرض إعلانك على الصفحة الرئيسية.',
        type: 'system',
        link: `/admin-dashboard`,
      }).send();
    }
  }
  // ❌ رفض الإعلان
  async reject(reason = '') {
    const admin = await User.getByUid(auth.currentUser.uid);
    await this.update({
      reviewStatus: 'rejected',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason,
    });

    if (this.userId) {
      await new Notification({
        receiver_id: this.userId,
        title: '❌ تم رفض إعلانك الواجهة',
        body: `سبب الرفض: ${reason || 'غير مذكور'}`,
        type: 'system',
        link: `/`,
      }).send();
    }
  }

  // 🔄 إرجاع الإعلان لحالة المراجعة
  async returnToPending() {
    const admin = await User.getByUid(auth.currentUser.uid);
    await this.update({
      reviewStatus: 'pending',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });

    if (this.userId) {
      await new Notification({
        receiver_id: this.userId,
        title: '🔄 إعلانك الآن قيد المراجعة',
        body: 'تمت إعادة إعلانك للمراجعة من قبل الإدارة.',
        type: 'system',
        link: `/`,
      }).send();
    }
  }

  // ⏳ تفعيل الإعلان لمدة معينة
  async adsActivation(days) {
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  // ❌ إلغاء تفعيل الإعلان يدويًا
  async removeAds() {
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  // ✅ التأكد من انتهاء مدة الإعلان وتعطيله إن لزم
  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      console.log("HomepageAdvertisement.#handleExpiry - deactivating expired ad:", data.id);
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, 'HomepageAdvertisements', data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new HomepageAdvertisement(data);
  }

  // ✅ جلب إعلان حسب ID
  static async getById(id) {
    const snap = await getDoc(doc(db, 'HomepageAdvertisements', id));
    return snap.exists()
      ? await HomepageAdvertisement.#handleExpiry(snap.data())
      : null;
  }

  // ✅ جلب كل الإعلانات
  static async getAll() {
    const snap = await getDocs(collection(db, 'HomepageAdvertisements'));
    const ads = [];
    for (const docSnap of snap.docs) {
      const ad = await HomepageAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  // ✅ جلب الإعلانات حسب حالة المراجعة
  static async getByReviewStatus(status) {
    const q = query(
      collection(db, 'HomepageAdvertisements'),
      where('reviewStatus', '==', status)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new HomepageAdvertisement(d.data()));
  }

  // ✅ الاشتراك اللحظي في الإعلانات حسب حالة المراجعة (pending | approved | rejected)
  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, 'HomepageAdvertisements'),
      where('reviewStatus', '==', status)
    );
    return onSnapshot(q, async (snap) => {
      const ads = [];
      for (const doc of snap.docs) {
        const ad = await HomepageAdvertisement.#handleExpiry(doc.data());
        if (ad) ads.push(ad);
      }
      callback(ads);
    });
  }

  // ✅ الاشتراك اللحظي في جميع الإعلانات
  static subscribeToAll(callback) {
    const q = query(collection(db, 'HomepageAdvertisements'));
    return onSnapshot(q, async (snap) => {
      console.log("HomepageAdvertisement.subscribeToAll - received snapshots:", snap.docs.length);
      const ads = [];
      for (const doc of snap.docs) {
        const ad = await HomepageAdvertisement.#handleExpiry(doc.data());
        if (ad) ads.push(ad);
      }
      console.log("HomepageAdvertisement.subscribeToAll - processed ads:", ads.length);
      callback(ads);
    });
  }

  // ✅ الاشتراك اللحظي في الإعلانات المفعلة
  static subscribeActiveAds(callback) {
    const q = query(
      collection(db, 'HomepageAdvertisements'),
      where('ads', '==', true)
    );
    return onSnapshot(q, async (snap) => {
      const ads = [];
      for (const doc of snap.docs) {
        const ad = await HomepageAdvertisement.#handleExpiry(doc.data());
        if (ad) ads.push(ad);
      }
      callback(ads);
    });
  }

  // 🔁 استماع لحظي لإعلانات مستخدم معين
  static subscribeByUserId(userId, callback) {
    const q = query(
      collection(db, 'HomepageAdvertisements'),
      where('userId', '==', userId)
    );
    return onSnapshot(q, async (snap) => {
      console.log(`HomepageAdvertisement.subscribeByUserId - received snapshots for user ${userId}:`, snap.docs.length);
      const ads = [];
      for (const doc of snap.docs) {
        const ad = await HomepageAdvertisement.#handleExpiry(doc.data());
        if (ad) ads.push(ad);
      }
      console.log(`HomepageAdvertisement.subscribeByUserId - processed ads for user ${userId}:`, ads.length);
      callback(ads);
    });
  }

  // 📤 رفع صورة الإعلان
  async #uploadImage(file) {
    const storage = getStorage();
    const imageRef = ref(storage, `homepage_ads/${this.#id}/main.jpg`);
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  }

  // 📤 رفع إيصال الدفع
  async #uploadReceipt(file) {
    const storage = getStorage();
    const refPath = ref(storage, `homepage_ads/${this.#id}/receipt.jpg`);
    await uploadBytes(refPath, file);
    return await getDownloadURL(refPath);
  }

  // 🗑️ حذف صورة الإعلان
  async #deleteImage() {
    const storage = getStorage();
    const imageRef = ref(storage, `homepage_ads/${this.#id}/main.jpg`);
    try {
      await deleteObject(imageRef);
    } catch (_) {}
  }

  // 🗑️ حذف إيصال الدفع
  async #deleteReceipt() {
    const storage = getStorage();
    const receiptRef = ref(storage, `homepage_ads/${this.#id}/receipt.jpg`);
    try {
      await deleteObject(receiptRef);
    } catch (_) {}
  }

  // 📦 تجهيز كائن البيانات للتخزين
  #getAdData() {
    return {
      image: this.image,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
      receipt_image: this.receipt_image,
      reviewStatus: this.reviewStatus,
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
      userId: this.userId,
      createdAt: this.createdAt,
      title: this.title, // Add title to the data
    };
  }
}

export default HomepageAdvertisement;
