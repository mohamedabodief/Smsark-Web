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

class RealEstateDeveloperAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.developer_name = data.developer_name;
    this.description = data.description;
    this.project_types = data.project_types;
    this.image = data.image;
    this.phone = data.phone;
    this.location = data.location;
    this.website_url = data.website_url;
    this.price_start_from = data.price_start_from;
    this.price_end_to = data.price_end_to;
    this.userId = data.userId;
    this.type_of_user = data.type_of_user; // دايمًا developer
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
  }

  get id() {
    return this.#id;
  }

  async save() {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const docRef = await addDoc(colRef, {
      developer_name: this.developer_name,
      description: this.description,
      project_types: this.project_types,
      image: this.image,
      phone: this.phone,
      location: this.location,
      website_url: this.website_url,
      price_start_from: this.price_start_from,
      price_end_to: this.price_end_to,
      userId: this.userId,
      type_of_user: this.type_of_user,
      ads: this.ads,
      adExpiryTime: this.adExpiryTime,
    });

    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id }); // حفظ id داخليًا
    return this.#id;
  }

  async update(updates) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
    await deleteDoc(docRef);
  }

  async removeAds() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  async adsActivation(days) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح لتفعيل الإعلانات');
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });

    setTimeout(() => this.removeAds().catch((e) => console.error(e)), ms);
  }

  static async getById(id) {
    const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await RealEstateDeveloperAdvertisement.#handleExpiry(
        snapshot.data()
      );
    }
    return null;
  }

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
   * الاستماع اللحظي لإعلانات المطورين النشطة فقط
   */
  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        ads.push(
          await RealEstateDeveloperAdvertisement.#handleExpiry(docSnap.data())
        );
      }
      callback(ads);
    });
  }

  /**
   * جلب جميع إعلانات المطورين العقاريين
   */
  static async getAll() {
    const { getDocs, collection } = await import('firebase/firestore');
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const snapshot = await getDocs(colRef);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(
        docSnap.data()
      );
      if (ad) ads.push(ad); // استبعاد اللي انتهت صلاحيتهم وتم إيقافهم
    }
    return ads;
  }

  /**
   * جلب جميع إعلانات مطور معيّن حسب userId
   */
  static async getByUserId(userId) {
    const { getDocs, collection, where, query } = await import(
      'firebase/firestore'
    );
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(
        docSnap.data()
      );
      if (ad) ads.push(ad);
    }
    return ads;
  }

  /**
   * جلب الإعلانات النشطة فقط المرتبطة بمطور معيّن
   */
  static async getActiveByUser(userId) {
    const { getDocs, collection, where, query } = await import(
      'firebase/firestore'
    );
    const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
    const q = query(
      colRef,
      where('userId', '==', userId),
      where('ads', '==', true)
    );
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(
        docSnap.data()
      );
      if (ad) ads.push(ad);
    }
    return ads;
  }
}

export default RealEstateDeveloperAdvertisement;
