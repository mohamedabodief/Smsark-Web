// استيراد وظائف Firebase
import {
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  where,
  onSnapshot,
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

class RealEstateDeveloperAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.developer_name = data.developer_name;
    this.description = data.description;
    this.project_types = data.project_types;
    this.images = data.images || [];
    this.phone = data.phone;
    this.location = data.location;
    this.price_start_from = data.price_start_from;
    this.price_end_to = data.price_end_to;
    this.userId = data.userId;
    this.type_of_user = data.type_of_user;
    this.rooms = data.rooms || null;
    this.bathrooms = data.bathrooms || null;
    this.floor = data.floor || null;
    this.furnished = data.furnished || false;
    this.status = data.status || 'تحت العرض';
    this.paymentMethod = data.paymentMethod || null;
    this.negotiable = data.negotiable || false;
    this.deliveryTerms = data.deliveryTerms || null;
    this.features = data.features || [];
    this.area = data.area || null;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.receipt_image = data.receipt_image || null;
    this.reviewStatus = data.reviewStatus || 'pending';
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
  }

  // ✅ getter للـ ID
  get id() {
    return this.#id;
  }

  // ✅ إنشاء إعلان جديد + رفع الصور + إيصال الدفع + إرسال إشعار للمشرف
  async save(imagesFiles = [], receiptFile = null) {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    if (imagesFiles.length > 0) {
      const imageUrls = await this.#uploadImages(imagesFiles);
      this.images = imageUrls;
      await updateDoc(docRef, { images: imageUrls });
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
          title: 'إعلان مطور جديد بانتظار المراجعة',
          body: `المطور: ${this.developer_name}`,
          type: 'system',
          link: `/admin/developer-ads/${this.#id}`,
        }).send()
      )
    );

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان + صور جديدة + إيصال جديد
  async update(updates = {}, newImagesFiles = null, newReceiptFile = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);

    if (newImagesFiles?.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImagesFiles);
      updates.images = newUrls;
      this.images = newUrls;
    }

    if (newReceiptFile) {
      const receiptUrl = await this.#uploadReceipt(newReceiptFile);
      updates.receipt_image = receiptUrl;
      this.receipt_image = receiptUrl;
    }

    if (
      updates.status &&
      !['تحت العرض', 'تحت التفاوض', 'منتهي'].includes(updates.status)
    ) {
      throw new Error('❌ الحالة غير صالحة');
    }

    await updateDoc(docRef, updates);
  }

  // ✅ حذف الإعلان بالكامل (من قاعدة البيانات + الصور)
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, 'RealEstateDeveloperAdvertisements', this.#id));
  }

  // ✅ الموافقة على الإعلان
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

    await new Notification({
      receiver_id: this.userId,
      title: '✅ تمت الموافقة على إعلانك العقاري',
      body: `تمت الموافقة على إعلانك "${this.developer_name}" وسيظهر في الواجهة.`,
      type: 'system',
      link: `/client/developer-ads/${this.#id}`,
    }).send();
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

    await new Notification({
      receiver_id: this.userId,
      title: '❌ تم رفض إعلانك العقاري',
      body: `تم رفض إعلانك "${this.developer_name}". السبب: ${
        reason || 'غير مذكور'
      }`,
      type: 'system',
      link: `/client/developer-ads/${this.#id}`,
    }).send();
  }

  // 🔁 إعادة الإعلان لحالة "pending"
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

    await new Notification({
      receiver_id: this.userId,
      title: '🔄 إعلانك الآن قيد المراجعة',
      body: `تمت إعادة إعلانك "${this.developer_name}" للمراجعة.`,
      type: 'system',
      link: `/client/developer-ads/${this.#id}`,
    }).send();
  }

  // ⏳ تفعيل الإعلان لفترة معينة
  async adsActivation(days) {
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  // ❌ إلغاء التفعيل
  async removeAds() {
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  // 📥 جلب إعلان واحد بالـ ID
  static async getById(id) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
    const snap = await getDoc(docRef);
    return snap.exists()
      ? new RealEstateDeveloperAdvertisement(snap.data())
      : null;
  }

  // 📥 جلب كل الإعلانات
  static async getAll() {
    const snap = await getDocs(
      collection(db, 'RealEstateDeveloperAdvertisements')
    );
    return snap.docs.map((d) => new RealEstateDeveloperAdvertisement(d.data()));
  }

  // 📥 جلب إعلانات حسب حالة المراجعة
  static async getByReviewStatus(status) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('reviewStatus', '==', status)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new RealEstateDeveloperAdvertisement(d.data()));
  }

  // 📥 جلب إعلانات مستخدم معين
  static async getByUserId(userId) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => new RealEstateDeveloperAdvertisement(d.data()));
  }

  // ✅ الاشتراك اللحظي في الإعلانات حسب حالة المراجعة
  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('reviewStatus', '==', status)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map(
        (d) => new RealEstateDeveloperAdvertisement(d.data())
      );
      callback(ads);
    });
  }

  // 🔁 استماع لحظي للإعلانات المفعلة
  static subscribeActiveAds(callback) {
    const q = query(
      collection(db, 'RealEstateDeveloperAdvertisements'),
      where('ads', '==', true)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map(
        (d) => new RealEstateDeveloperAdvertisement(d.data())
      );
      callback(ads);
    });
  }

  // 🔐 رفع صور الإعلان
  async #uploadImages(files = []) {
    const storage = getStorage();
    const urls = [];
    const limited = files.slice(0, 4);
    for (let i = 0; i < limited.length; i++) {
      const refPath = ref(
        storage,
        `developer_ads/${this.#id}/image_${i + 1}.jpg`
      );
      await uploadBytes(refPath, limited[i]);
      urls.push(await getDownloadURL(refPath));
    }
    return urls;
  }

  // 🔐 رفع إيصال الدفع
  async #uploadReceipt(file) {
    const storage = getStorage();
    const refPath = ref(storage, `developer_ads/${this.#id}/receipt.jpg`);
    await uploadBytes(refPath, file);
    return await getDownloadURL(refPath);
  }

  // 🗑️ حذف كل الصور
  async #deleteAllImages() {
    const dirRef = ref(getStorage(), `developer_ads/${this.#id}`);
    try {
      const list = await listAll(dirRef);
      for (const fileRef of list.items) await deleteObject(fileRef);
    } catch (_) {}
  }

  // 🗑️ حذف إيصال الدفع
  async #deleteReceipt() {
    const fileRef = ref(getStorage(), `developer_ads/${this.#id}/receipt.jpg`);
    try {
      await deleteObject(fileRef);
    } catch (_) {}
  }

  // 📤 تجهيز بيانات الإعلان للتخزين
  #getAdData() {
    return {
      developer_name: this.developer_name,
      description: this.description,
      project_types: this.project_types,
      images: this.images,
      phone: this.phone,
      location: this.location,
      price_start_from: this.price_start_from,
      price_end_to: this.price_end_to,
      userId: this.userId,
      type_of_user: this.type_of_user,
      rooms: this.rooms,
      bathrooms: this.bathrooms,
      floor: this.floor,
      furnished: this.furnished,
      status: this.status,
      paymentMethod: this.paymentMethod,
      negotiable: this.negotiable,
      deliveryTerms: this.deliveryTerms,
      features: this.features,
      area: this.area,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
      receipt_image: this.receipt_image,
      reviewStatus: this.reviewStatus,
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
    };
  }
}

export default RealEstateDeveloperAdvertisement;
