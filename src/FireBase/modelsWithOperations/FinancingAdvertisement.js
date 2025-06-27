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

  async update(updates) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);
    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    const docRef = doc(db, 'FinancingAdvertisements', this.#id);
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
    const docRef = doc(db, 'FinancingAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await FinancingAdvertisement.#handleExpiry(snapshot.data());
    }
    return null;
  }

  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, 'FinancingAdvertisements', data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new FinancingAdvertisement(data);
  }

  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'FinancingAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        ads.push(await FinancingAdvertisement.#handleExpiry(docSnap.data()));
      }
      callback(ads);
    });
  }
}

export default FinancingAdvertisement;
