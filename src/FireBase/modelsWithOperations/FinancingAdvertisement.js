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
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

class FinancingAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title;
    this.description = data.description;
    this.financing_model = data.financing_model;
    this.image = data.image;
    this.phone = data.phone;
    this.start_limit = data.start_limit;
    this.end_limit = data.end_limit;
    this.org_name = data.org_name;
    this.type_of_user = data.type_of_user;
    this.userId = data.userId;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;

    // نسب الفائدة حسب سنوات السداد
    this.interest_rate_upto_5 = data.interest_rate_upto_5;
    this.interest_rate_upto_10 = data.interest_rate_upto_10;
    this.interest_rate_above_10 = data.interest_rate_above_10;
  }

  get id() {
    return this.#id;
  }

  /**
   * حفظ إعلان التمويل في قاعدة البيانات
   */
  async save() {
    const colRef = collection(db, 'FinancingAdvertisements');
    const docRef = await addDoc(colRef, {
      title: this.title,
      description: this.description,
      financing_model: this.financing_model,
      image: this.image,
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
    });

    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    return this.#id;
  }

  /**
   * تحديث بيانات الإعلان
   */
  async update(updates) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);
    await updateDoc(docRef, updates);
  }

  /**
   * حذف الإعلان فقط (بدون الطلبات المرتبطة)
   */
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);
    await deleteDoc(docRef);
  }

  /**
   * حذف الإعلان وكل طلبات التمويل المرتبطة بيه
   */
  async deleteWithRequests() {
    if (!this.#id) throw new Error('الإعلان بدون ID غير قابل للحذف');

    // 1. حذف كل الطلبات المرتبطة بالإعلان
    const { getDocs, collection, where, query, deleteDoc } = await import(
      'firebase/firestore'
    );
    const reqRef = collection(db, 'FinancingRequests');
    const q = query(reqRef, where('advertisement_id', '==', this.#id));
    const reqSnap = await getDocs(q);
    for (const req of reqSnap.docs) {
      await deleteDoc(req.ref);
    }

    // 2. حذف الإعلان نفسه
    const adRef = doc(db, 'FinancingAdvertisements', this.#id);
    await deleteDoc(adRef);
  }

  /**
   * إيقاف الإعلانات يدويًا
   */
  async removeAds() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  /**
   * تفعيل الإعلان لفترة زمنية معينة (بالأيام)
   */
  async adsActivation(days) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لتفعيل الإعلانات');

    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });

    // حذف الإعلان تلقائيًا بعد انتهاء المدة
    setTimeout(() => this.removeAds().catch((e) => console.error(e)), ms);
  }

  /**
   * جلب إعلان التمويل حسب الـ ID
   */
  static async getById(id) {
    const docRef = doc(db, 'FinancingAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await FinancingAdvertisement.#handleExpiry(snapshot.data());
    }
    return null;
  }

  /**
   * التحقق من انتهاء مدة الإعلان، ولو انتهت يتم حذف الإعلان والطلبات المرتبطة
   */
  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      const ad = new FinancingAdvertisement(data);
      await ad.deleteWithRequests(); // حذف الإعلان والطلبات المرتبطة به
      return null;
    }
    return new FinancingAdvertisement(data);
  }

  /**
   * الاشتراك اللحظي في الإعلانات المفعّلة فقط
   */
  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'FinancingAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
        if (ad) ads.push(ad); // استبعاد الإعلانات اللي اتشالت
      }
      callback(ads);
    });
  }

  /**
   * جلب كل إعلانات التمويل (سواء مفعّلة أو منتهية)
   */
  static async getAll() {
    const { getDocs, collection } = await import('firebase/firestore');
    const colRef = collection(db, 'FinancingAdvertisements');
    const snapshot = await getDocs(colRef);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad); // استبعاد المحذوفين بسبب انتهاء المدة
    }
    return ads;
  }

  /**
   * جلب كل إعلانات التمويل الخاصة بمستخدم معيّن (سواء مفعّلة أو لا)
   */
  static async getByUserId(userId) {
    const { getDocs, collection, query, where } = await import(
      'firebase/firestore'
    );
    const colRef = collection(db, 'FinancingAdvertisements');
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * جلب الإعلانات المفعّلة فقط الخاصة بمستخدم معيّن
   */
  static async getActiveByUser(userId) {
    const { getDocs, collection, query, where } = await import(
      'firebase/firestore'
    );
    const colRef = collection(db, 'FinancingAdvertisements');
    const q = query(
      colRef,
      where('userId', '==', userId),
      where('ads', '==', true)
    );
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }
}

export default FinancingAdvertisement;
