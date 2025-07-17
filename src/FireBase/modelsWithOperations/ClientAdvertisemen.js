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

class ClientAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title;
    this.type = data.type;
    this.price = data.price;
    this.area = data.area;
    this.date_of_building = data.date_of_building;
    this.images = data.images || []; // ⬅️ مصفوفة روابط الصور
    this.location = data.location;
    this.address = data.address;
    this.city = data.city;
    this.governorate = data.governorate;
    this.phone = data.phone;
    this.user_name = data.user_name;
    this.userId = data.userId;
    this.ad_type = data.ad_type || 'بيع';
    this.ad_status = data.ad_status || 'تحت العرض';
    this.type_of_user = data.type_of_user || 'client';
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.description = data.description;
  }

  get id() {
    return this.#id;
  }

  /**
   * حفظ إعلان جديد مع رفع حتى ٤ صور
   */
  async save(imageFiles = []) {
    const colRef = collection(db, 'ClientAdvertisements');
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
   * تحديث بيانات الإعلان مع حذف ورفع صور جديدة (لو تم تمريرها)
   */
  async update(updates = {}, newImageFiles = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'ClientAdvertisements', this.#id);

    if (newImageFiles && newImageFiles.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImageFiles);
      updates.images = newUrls;
      this.images = newUrls;
    }

    await updateDoc(docRef, updates);
  }

  /**
   * حذف الإعلان من قاعدة البيانات مع حذف الصور من التخزين
   */
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    await this.#deleteAllImages();
    const docRef = doc(db, 'ClientAdvertisements', this.#id);
    await deleteDoc(docRef);
  }

  /**
   * إيقاف الإعلانات (ads = false) وإلغاء وقت الانتهاء
   */
  async removeAds() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  /**
   * تفعيل الإعلان لفترة زمنية معينة (بالأيام)، ثم إيقافه تلقائيًا بعد انتهاء المدة
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
   * جلب إعلان معين حسب الـ ID والتأكد من انتهاء مدة الإعلانات
   */
  static async getById(id) {
    const docRef = doc(db, 'ClientAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await ClientAdvertisement.#handleExpiry(snapshot.data());
    }
    return null;
  }

  /**
   * جلب كل الإعلانات في النظام (بما فيها المنتهية مع تحديث حالة الإعلانات)
   */
  static async getAll() {
    const colRef = collection(db, 'ClientAdvertisements');
    const snapshot = await getDocs(colRef);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * جلب كل الإعلانات الخاصة بمستخدم معين (مع التحقق من انتهاء الإعلانات)
   */
  static async getByUserId(userId) {
    const colRef = collection(db, 'ClientAdvertisements');
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * الاشتراك اللحظي في الإعلانات المفعّلة فقط
   */
  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'ClientAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
        if (ad) ads.push(ad);
      }
      callback(ads);
    });
  }

  /**
   * التحقق من انتهاء الإعلان وتحديثه إذا انتهت مدته
   */
  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, 'ClientAdvertisements', data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new ClientAdvertisement(data);
  }

  // -------------------------------
  // 🔒 دوال رفع الصور / حذفها
  // -------------------------------

  /**
   * رفع الصور إلى Firebase Storage (بحد أقصى ٤ صور)
   */
  async #uploadImages(files = []) {
    const storage = getStorage();
    const imageUrls = [];
    const limitedFiles = files.slice(0, 4);

    for (let i = 0; i < limitedFiles.length; i++) {
      const file = limitedFiles[i];
      const imageRef = ref(storage, `client_ads/${this.#id}/image_${i + 1}.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }

    return imageUrls;
  }

  /**
   * حذف كل الصور الخاصة بالإعلان من التخزين
   */
  async #deleteAllImages() {
    const storage = getStorage();
    const dirRef = ref(storage, `client_ads/${this.#id}`);
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
   * إرجاع نسخة البيانات الخام لحفظها في Firestore
   */
  #getAdData() {
    return {
      title: this.title,
      type: this.type,
      price: this.price,
      area: this.area,
      date_of_building: this.date_of_building,
      images: this.images,
      location: this.location,
      address: this.address,
      city: this.city,
      governorate: this.governorate,
      phone: this.phone,
      user_name: this.user_name,
      userId: this.userId,
      ad_type: this.ad_type,
      ad_status: this.ad_status,
      type_of_user: this.type_of_user,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
      description: this.description,
    };
  }
}

export default ClientAdvertisement;
