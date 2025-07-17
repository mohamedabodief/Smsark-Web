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
import { db } from '../firebaseConfig';

class RealEstateDeveloperAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.developer_name = data.developer_name;
    this.description = data.description;
    this.project_types = data.project_types;
    this.images = data.images || []; // مصفوفة روابط الصور
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
    this.status = data.status || null;
    this.paymentMethod = data.paymentMethod || null;
    this.negotiable = data.negotiable || false;
    this.deliveryTerms = data.deliveryTerms || null;
    this.features = data.features || [];
    this.area = data.area || null;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
  }

  get id() {
    return this.#id;
  }

  /**
   * إنشاء إعلان جديد لمطور عقاري في Firestore
   * + رفع الصور (بحد أقصى ٤ صور)
   */
  async save(imagesFiles = []) {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;

    await updateDoc(docRef, { id: this.#id });

    if (imagesFiles.length > 0) {
      const imageUrls = await this.#uploadImages(imagesFiles);
      this.images = imageUrls;
      await updateDoc(docRef, { images: imageUrls });
    }

    return this.#id;
  }

  /**
   * تحديث بيانات إعلان المطور العقاري
   * + حذف الصور القديمة ورفع الجديدة إن وُجدت
   */
  async update(updates = {}, newImagesFiles = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);

    if (newImagesFiles && newImagesFiles.length > 0) {
      await this.#deleteAllImages();
      const newImageUrls = await this.#uploadImages(newImagesFiles);
      updates.images = newImageUrls;
      this.images = newImageUrls;
    }

    await updateDoc(docRef, updates);
  }

  /**
   * حذف الإعلان نهائيًا من Firestore
   * + حذف جميع الصور المرتبطة به من التخزين
   */
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    await this.#deleteAllImages();
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
    await deleteDoc(docRef);
  }

  /**
   * إيقاف الإعلانات المدفوعة يدويًا
   * (ads = false + حذف وقت الانتهاء)
   */
  async removeAds() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  /**
   * تفعيل الإعلان لفترة زمنية (باليوم)
   * + تحديد وقت الانتهاء
   * + يتم إيقاف الإعلان تلقائيًا بعد انتهاء المدة
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
   * التحقق من انتهاء صلاحية الإعلان
   * إذا انتهت المدة يتم تعطيل الإعلان تلقائيًا
   */
  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, 'RealEstateDeveloperAdvertisements', data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new RealEstateDeveloperAdvertisement(data);
  }

  /**
   * جلب إعلان مطور عقاري محدد حسب ID
   * + التحقق من صلاحية الإعلان
   */
  static async getById(id) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await RealEstateDeveloperAdvertisement.#handleExpiry(snapshot.data());
    }
    return null;
  }

  /**
   * جلب جميع إعلانات المطورين العقاريين
   * + التحقق من صلاحية الإعلانات
   */
  static async getAll() {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const snapshot = await getDocs(colRef);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * جلب جميع إعلانات مستخدم معيّن (حسب userId)
   */
  static async getByUserId(userId) {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * جلب الإعلانات المفعّلة (المدفوعة) فقط لمستخدم معيّن
   */
  static async getActiveByUser(userId) {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const q = query(
      colRef,
      where('userId', '==', userId),
      where('ads', '==', true)
    );
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * الاشتراك اللحظي (Real-time) في الإعلانات المفعّلة فقط
   * يتم استدعاء callback عند أي تغيير
   */
  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(docSnap.data());
        if (ad) ads.push(ad);
      }
      callback(ads);
    });
  }

  // --------------------------------
  // 🔒 دوال داخلية لإدارة الصور
  // --------------------------------

  /**
   * رفع الصور إلى Firebase Storage (حتى ٤ صور)
   * + حفظ روابطها
   */
  async #uploadImages(files = []) {
    const storage = getStorage();
    const imageUrls = [];
    const limitedFiles = files.slice(0, 4);

    for (let i = 0; i < limitedFiles.length; i++) {
      const file = limitedFiles[i];
      const imageRef = ref(storage, `ads/${this.#id}/image_${i + 1}.jpg`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }

    return imageUrls;
  }

  /**
   * حذف جميع الصور المرتبطة بالإعلان من Firebase Storage
   */
  async #deleteAllImages() {
    const storage = getStorage();
    const dirRef = ref(storage, `ads/${this.#id}`);
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
   * يُستخدم في الدوال save/update
   */
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
    };
  }
}

export default RealEstateDeveloperAdvertisement;
