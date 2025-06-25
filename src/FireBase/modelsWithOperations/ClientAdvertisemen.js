import {
  collection,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

class ClientAdvertisement {
  #id = null;
  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title;
    this.type = data.type;
    this.price = data.price;
    this.status = data.status;
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

    this.ad_type = data.ad_type || 'بيع'; // القيمة الافتراضية
    // القيم المحتملة: "بيع" | "إيجار" | "شراء"

    this.ad_status = data.ad_status || 'تحت العرض'; // القيمة الافتراضية
    // القيم المحتملة: "تحت العرض" | "تحت التفاوض" | "منتهي"

    this.type_of_user = 'client';
  }

  get id() {
    return this.#id;
  }

  async save() {
    const colRef = collection(db, 'ClientAdvertisements'); // ✅ اسم الكوليكشن الجديد
    const docRef = await addDoc(colRef, {
      title: this.title,
      type: this.type,
      price: this.price,
      status: this.status,
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
      type_of_user: this.type_of_user,
    });

    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    return this.#id;
  }

  async update(updates) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'ClientAdvertisements', this.#id); // ✅ نفس الكوليكشن
    await updateDoc(docRef, updates);
  }

  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    const docRef = doc(db, 'ClientAdvertisements', this.#id); // ✅ نفس الكوليكشن
    await deleteDoc(docRef);
  }

  static async getById(id) {
    const docRef = doc(db, 'ClientAdvertisements', id); // ✅ نفس الكوليكشن
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new ClientAdvertisement({ id, ...snapshot.data() });
    }
    return null;
  }
}

export default ClientAdvertisement;
