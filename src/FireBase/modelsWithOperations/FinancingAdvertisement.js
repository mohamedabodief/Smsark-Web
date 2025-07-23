// استيراد الوظائف من Firebase
import {
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
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
import Notification from '../MessageAndNotification/Notification';
import User from './User';

class FinancingAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title;
    this.description = data.description;
    this.financing_model = data.financing_model;
    this.images = data.images || [];
    this.phone = data.phone;
    this.start_limit = Number(data.start_limit);
    this.end_limit = Number(data.end_limit);
    this.org_name = data.org_name;
    this.type_of_user = data.type_of_user;
    this.userId = data.userId;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.interest_rate_upto_5 = data.interest_rate_upto_5;
    this.interest_rate_upto_10 = data.interest_rate_upto_10;
    this.interest_rate_above_10 = data.interest_rate_above_10;
    this.receipt_image = data.receipt_image || null;
    this.reviewStatus = data.reviewStatus || 'pending';
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.status = data.status || 'تحت العرض';
    this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
  }

  // ✅ إرجاع المعرف الداخلي للإعلان
  get id() {
    return this.#id;
  }

  // ✅ إنشاء إعلان جديد + رفع الصور + إيصال الدفع + إشعار الأدمن
  async save(imageFiles = [], receiptFile = null) {
    const colRef = collection(db, 'FinancingAdvertisements');
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    if (imageFiles.length > 0) {
      const urls = await this.#uploadImages(imageFiles);
      this.images = urls;
      await updateDoc(docRef, { images: urls });
    }

    if (receiptFile) {
      const receiptUrl = await this.#uploadReceipt(receiptFile);
      this.receipt_image = receiptUrl;
      await updateDoc(docRef, { receipt_image: receiptUrl });
    }

    // إرسال إشعار للمشرفين
    const admins = await User.getAllUsersByType('admin');
    await Promise.all(
      admins.map((admin) =>
        new Notification({
          receiver_id: admin.uid,
          title: 'إعلان تمويلي جديد بانتظار المراجعة',
          body: `العنوان: ${this.title}`,
          type: 'system',
          link: `/admin/financing-ads/${this.#id}`,
        }).send()
      )
    );

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان (بما في ذلك الصور أو إيصال الدفع)
  async update(updates = {}, newImageFiles = null, newReceiptFile = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);

    if (newImageFiles && Array.isArray(newImageFiles) && newImageFiles.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImageFiles);
      updates.images = newUrls;
      this.images = newUrls;
    } // إذا لم يتم تمرير صور جديدة، لا تغير الصور القديمة

    if (newReceiptFile) {
      const receiptUrl = await this.#uploadReceipt(newReceiptFile);
      updates.receipt_image = receiptUrl;
      this.receipt_image = receiptUrl;
    }

    // تحقق من صحة قيمة الحالة
    if (
      updates.status &&
      !['تحت العرض', 'تحت التفاوض', 'منتهي'].includes(updates.status)
    ) {
      throw new Error('❌ قيمة حالة الإعلان غير صالحة');
    }

    await updateDoc(docRef, updates);
  }

  // ✅ حذف الإعلان نهائيًا مع صوره وإيصال الدفع
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'FinancingAdvertisements', this.#id));
  }

  // ✅ الموافقة على الإعلان من قبل الأدمن
  async approve() {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'approved',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    };
    await this.update(updates);

    await new Notification({
      receiver_id: this.userId,
      title: 'تمت الموافقة على إعلانك التمويلي',
      body: `تمت الموافقة على إعلانك "${this.title}" وسيتم عرضه في الواجهة.`,
      type: 'system',
      link: `/client/ads/${this.#id}`,
    }).send();
  }

  // ❌ رفض الإعلان مع ذكر السبب
  async reject(reason = '') {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'rejected',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason,
    };
    await this.update(updates);

    await new Notification({
      receiver_id: this.userId,
      title: '❌ تم رفض إعلانك التمويلي',
      body: `تم رفض إعلانك "${this.title}". السبب: ${reason || 'غير مذكور'}`,
      type: 'system',
      link: `/client/ads/${this.#id}`,
    }).send();
  }

  // 🔁 إعادة الإعلان لحالة المراجعة "pending"
  async returnToPending() {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'pending',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    };
    await this.update(updates);

    await new Notification({
      receiver_id: this.userId,
      title: 'إعلانك التمويلي الآن تحت المراجعة',
      body: `تمت إعادة إعلانك "${this.title}" لحالة المراجعة.`,
      type: 'system',
      link: `/client/ads/${this.#id}`,
    }).send();
  }

  // ⏳ تفعيل الإعلان لعدد أيام محدد
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

  // ============================
  // 📦 دوال static (جلب البيانات)
  // ============================

  // ✅ جلب إعلان واحد باستخدام ID
  static async getById(id) {
    const snap = await getDoc(doc(db, 'FinancingAdvertisements', id));
    return snap.exists() ? new FinancingAdvertisement(snap.data()) : null;
  }

  // ✅ جلب جميع الإعلانات
  static async getAll() {
    const col = collection(db, 'FinancingAdvertisements');
    const snap = await getDocs(col);
    return snap.docs.map((d) => new FinancingAdvertisement(d.data()));
  }

  // ✅ جلب الإعلانات حسب حالة المراجعة (pending | approved | rejected)
  static async getByReviewStatus(status) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('reviewStatus', '==', status)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new FinancingAdvertisement(d.data()));
  }

  // ✅ الاشتراك اللحظي في الإعلانات حسب حالة المراجعة (pending | approved | rejected)
  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('reviewStatus', '==', status)
    );
    return onSnapshot(q, (snapshot) => {
      const ads = snapshot.docs.map(
        (docSnap) => new FinancingAdvertisement(docSnap.data())
      );
      callback(ads);
    });
  }

  // ✅ جلب الإعلانات الخاصة بمستخدم معيّن
  static async getByUserId(userId) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new FinancingAdvertisement(d.data()));
  }

  // ✅ الاشتراك اللحظي في الإعلانات المفعّلة فقط (Real-time listener)
  static subscribeActiveAds(callback) {
    const q = query(
      collection(db, 'FinancingAdvertisements'),
      where('ads', '==', true)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map((d) => new FinancingAdvertisement(d.data()));
      callback(ads);
    });
  }

  // ============================
  // 🔐 دوال خاصة داخلية
  // ============================

  // 📤 رفع صور الإعلان
  async #uploadImages(files = []) {
    const storage = getStorage();
    const urls = [];
    const limited = files.slice(0, 4);
    for (let i = 0; i < limited.length; i++) {
      const refPath = ref(
        storage,
        `financing_ads/${this.#id}/image_${i + 1}.jpg`
      );
      await uploadBytes(refPath, limited[i]);
      urls.push(await getDownloadURL(refPath));
    }
    return urls;
  }

  // 📤 رفع إيصال الدفع
  async #uploadReceipt(file) {
    const storage = getStorage();
    const refPath = ref(storage, `financing_ads/${this.#id}/receipt.jpg`);
    await uploadBytes(refPath, file);
    return await getDownloadURL(refPath);
  }

  // 🗑️ حذف جميع صور الإعلان
  async #deleteAllImages() {
    const storage = getStorage();
    const dirRef = ref(storage, `financing_ads/${this.#id}`);
    try {
      const list = await listAll(dirRef);
      await Promise.all(list.items.map((ref) => deleteObject(ref)));
    } catch (_) {}
  }

  // 🗑️ حذف إيصال الدفع
  async #deleteReceipt() {
    const storage = getStorage();
    const receiptRef = ref(storage, `financing_ads/${this.#id}/receipt.jpg`);
    try {
      await deleteObject(receiptRef);
    } catch (_) {}
  }

  // 📋 تجهيز كائن البيانات الكامل لتخزينه في Firestore
  #getAdData() {
    return {
      title: this.title,
      description: this.description,
      financing_model: this.financing_model,
      images: this.images,
      phone: this.phone,
      start_limit: this.start_limit,
      end_limit: this.end_limit,
      org_name: this.org_name,
      type_of_user: this.type_of_user,
      userId: this.userId,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
      interest_rate_upto_5: this.interest_rate_upto_5,
      interest_rate_upto_10: this.interest_rate_upto_10,
      interest_rate_above_10: this.interest_rate_above_10,
      receipt_image: this.receipt_image,
      reviewStatus: this.reviewStatus,
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
      status: this.status,
      ...(this.adPackage !== undefined && this.adPackage !== null ? { adPackage: this.adPackage } : {}),
    };
  }
}

export default FinancingAdvertisement;
