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
    this.images = data.images;
    this.location = data.location;
    this.address = data.address;
    this.city = data.city;
    this.governorate = data.governorate;
    this.phone = data.phone;
    this.user_name = data.user_name;
    this.userId = data.userId;
    this.ad_type = data.ad_type || 'بيع'; // "بيع" | "إيجار" | "شراء"
    this.ad_status = data.ad_status || 'تحت العرض'; // "تحت العرض" | "تحت التفاوض" | "منتهي"
    this.type_of_user = data.type_of_user || 'client';
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.description = data.description;
  }

  get id() {
    return this.#id;
  }

  async save() {
    const colRef = collection(db, 'ClientAdvertisements');
    const docRef = await addDoc(colRef, {
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
    description:this.description 
    });

    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    return this.#id;
  }

  async update(updates) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'ClientAdvertisements', this.#id);
    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    const docRef = doc(db, 'ClientAdvertisements', this.#id);
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

    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  static async getById(id) {
    const docRef = doc(db, 'ClientAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await ClientAdvertisement.#handleExpiry(snapshot.data());
    }
    return null;
  }
  // get all ads
  ////////////////////////////////////////////////
static async getAll() {
  const colRef = collection(db, 'ClientAdvertisements');
  const snapshot = await getDocs(colRef);
  const allAds = [];
  for (const docSnap of snapshot.docs) {
    allAds.push(new ClientAdvertisement(docSnap.data()));
  }

  return allAds;
}
////////////////////////////////////////////
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

  static subscribeActiveAds(callback) {
    const colRef = collection(db, 'ClientAdvertisements');
    const q = query(colRef, where('ads', '==', true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        ads.push(await ClientAdvertisement.#handleExpiry(docSnap.data()));
      }
      callback(ads);
    });
  }
}

export default ClientAdvertisement;
