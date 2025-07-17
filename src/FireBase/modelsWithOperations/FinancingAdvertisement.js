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
import { db } from '../firebaseConfig';

class FinancingAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title;
    this.description = data.description;
    this.financing_model = data.financing_model;
    this.images = data.images || []; // ⬅️ مصفوفة روابط الصور
    this.phone = data.phone;
    this.start_limit = data.start_limit;
    this.end_limit = data.end_limit;
    this.org_name = data.org_name;
    this.type_of_user = data.type_of_user;
    this.userId = data.userId;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.interest_rate_upto_5 = data.interest_rate_upto_5;
    this.interest_rate_upto_10 = data.interest_rate_upto_10;
    this.interest_rate_above_10 = data.interest_rate_above_10;
  }

  get id() {
    return this.#id;
  }

  /**
   * إنشاء إعلان تمويلي جديد في Firestore
   * + رفع الصور (حتى 4) إلى Firebase Storage
   */
  async save(imageFiles = []) {
    const colRef = collection(db, 'FinancingAdvertisements');
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;

    await updateDoc(docRef, { id: this.#id });

    if (imageFiles.length > 0) {
      const urls = await this.#uploadImages(imageFiles);
      this.images = urls;
      await updateDoc(docRef, { images: urls });
    }

    return this.#id;
  }

  /**
   * تحديث بيانات الإعلان في Firestore
   * + حذف الصور القديمة (اختياري) ورفع الجديدة
   */
  async update(updates = {}, newImageFiles = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);

    if (newImageFiles && newImageFiles.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImageFiles);
      updates.images = newUrls;
      this.images = newUrls;
    }

    await updateDoc(docRef, updates);
  }

  /**
   * حذف الإعلان من Firestore
   * + حذف الصور المرتبطة به من Firebase Storage
   */
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    await this.#deleteAllImages();
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);
    await deleteDoc(docRef);
  }

  /**
   * حذف الإعلان وكل طلبات التمويل المرتبطة به
   * + حذف الصور من التخزين
   */
  async deleteWithRequests() {
    if (!this.#id) throw new Error('الإعلان بدون ID غير قابل للحذف');

    const reqRef = collection(db, 'FinancingRequests');
    const q = query(reqRef, where('advertisement_id', '==', this.#id));
    const reqSnap = await getDocs(q);
    for (const req of reqSnap.docs) {
      await deleteDoc(req.ref);
    }

    await this.#deleteAllImages();
    const adRef = doc(db, 'FinancingAdvertisements', this.#id);
    await deleteDoc(adRef);
  }

  /**
   * إيقاف تفعيل الإعلان يدويًا (ads = false + إلغاء الوقت)
   */
  async removeAds() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  /**
   * تفعيل الإعلان لفترة زمنية معينة (بـ عدد أيام)
   * + ضبط وقت الانتهاء
   * + إيقاف تلقائي بعد انتهاء المدة
   */
  async adsActivation(days) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لتفعيل الإعلانات');
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });

    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  /**
   * التحقق من انتهاء مدة التفعيل، وحذف الإعلان + الطلبات لو انتهى
   */
  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      const ad = new FinancingAdvertisement(data);
      await ad.deleteWithRequests();
      return null;
    }
    return new FinancingAdvertisement(data);
  }

  /**
   * جلب إعلان تمويلي واحد باستخدام ID
   * + فحص وقت الانتهاء
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
   * جلب جميع إعلانات التمويل (المفعّلة وغير المفعّلة)
   * + فحص الإعلانات المنتهية تلقائيًا
   */
  static async getAll() {
    const colRef = collection(db, 'FinancingAdvertisements');
    const snapshot = await getDocs(colRef);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * جلب إعلانات التمويل الخاصة بمستخدم معيّن (بـ userId)
   * + فحص الانتهاء
   */
  static async getByUserId(userId) {
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
   * جلب الإعلانات المفعّلة فقط لمستخدم معيّن
   */
  static async getActiveByUser(userId) {
    const colRef = collection(db, 'FinancingAdvertisements');
    const q = query(colRef, where('userId', '==', userId), where('ads', '==', true));
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * الاشتراك اللحظي في الإعلانات المفعّلة فقط (Real-time)
   */
  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'FinancingAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        const ad = await FinancingAdvertisement.#handleExpiry(docSnap.data());
        if (ad) ads.push(ad);
      }
      callback(ads);
    });
  }

  // -------------------------------
  // 🔒 دوال داخلية لرفع/حذف الصور
  // -------------------------------

  /**
   * رفع حتى 4 صور إلى Firebase Storage
   * + حفظ روابطها في Firestore
   */
  async #uploadImages(files = []) {
    const storage = getStorage();
    const imageUrls = [];
    const limitedFiles = files.slice(0, 4);

    for (let i = 0; i < limitedFiles.length; i++) {
      const file = limitedFiles[i];
      const imageRef = ref(storage, `financing_ads/${this.#id}/image_${i + 1}.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }

    return imageUrls;
  }

  /**
   * حذف كل الصور المرتبطة بالإعلان من التخزين
   */
  async #deleteAllImages() {
    const storage = getStorage();
    const dirRef = ref(storage, `financing_ads/${this.#id}`);
    try {
      const list = await listAll(dirRef);
      for (const itemRef of list.items) {
        await deleteObject(itemRef);
      }
    } catch (err) {
      console.warn('⚠️ فشل حذف الصور:', err.message);
    }
  }

  /**
   * تجهيز كائن البيانات الكامل للإعلان
   * يُستخدم في `save()` و `update()`
   */
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
    };
  }
}

export default FinancingAdvertisement;
