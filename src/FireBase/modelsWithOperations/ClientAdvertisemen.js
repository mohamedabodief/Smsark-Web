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

class ClientAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title;
    this.type = data.type;
    this.price = data.price;
    this.area = data.area;
    this.date_of_building = data.date_of_building;
    this.images = data.images || [];
    this.location = data.location;
    this.address = data.address;
    this.city = data.city;
    this.governorate = data.governorate;
    this.phone = data.phone;
    this.user_name = data.user_name;
    this.userId = data.userId;
    this.ad_type = data.ad_type || 'بيع';
    this.ad_status = data.ad_status || 'pending';
    this.type_of_user = data.type_of_user || 'client';
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.description = data.description;
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.reviewStatus = data.reviewStatus || 'pending'; // 👈 المراجعة (pending | approved | rejected)
    this.status = data.status || 'تحت العرض'; // 👈 حالة الإعلان من منظور التفاوض (تحت العرض | تحت التفاوض | منتهي)
    this.receipt_image = data.receipt_image || null; // 👈 إيصال الدفع
  }

  get id() {
    return this.#id;
  }

  // ✅ حفظ إعلان جديد + رفع صور + إشعار الأدمن
  async save(imageFiles = [], receiptFile = null) {
    const colRef = collection(db, 'ClientAdvertisements');
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

    const admins = await User.getAllUsersByType('admin');
    await Promise.all(
      admins.map((admin) => {
        const notif = new Notification({
          receiver_id: admin.uid,
          title: 'إعلان جديد بانتظار المراجعة',
          body: `العنوان: ${this.title}`,
          type: 'system',
          link: `/admin/client-ads/${this.#id}`,
        });
        return notif.send();
      })
    );

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان أو الصور أو المراجعة
  async update(updates = {}, newImageFiles = null, newReceiptFile = null) {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
    const docRef = doc(db, 'ClientAdvertisements', this.#id);

    if (newImageFiles && newImageFiles.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImageFiles);
      updates.images = newUrls;
      this.images = newUrls;
    }

    if (newReceiptFile) {
      const newReceiptUrl = await this.#uploadReceipt(newReceiptFile);
      updates.receipt_image = newReceiptUrl;
      this.receipt_image = newReceiptUrl;
    }

    await updateDoc(docRef, updates);
  }

  // ✅ حذف الإعلان + الصور
  async delete() {
    if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    const docRef = doc(db, 'ClientAdvertisements', this.#id);
    await deleteDoc(docRef);
  }

  // ✅ تفعيل الإعلان لفترة محددة
  async adsActivation(days) {
    if (!this.#id) throw new Error('الإعلان بدون ID لتفعيله');
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  // ✅ إيقاف الإعلان يدويًا أو تلقائيًا
  async removeAds() {
    if (!this.#id) throw new Error('الإعلان بدون ID لإيقافه');
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  // ✅ الموافقة على الإعلان
  async approveAd() {
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

    const notif = new Notification({
      receiver_id: this.userId,
      title: 'تمت الموافقة على إعلانك',
      body: `إعلانك "${this.title}" تمت الموافقة عليه.`,
      type: 'system',
      link: `/client/ads/${this.#id}`,
    });
    await notif.send();

    const otherAdmins = (await User.getAllUsersByType('admin')).filter(
      (a) => a.uid !== admin.uid
    );
    await Promise.all(
      otherAdmins.map((admin2) =>
        new Notification({
          receiver_id: admin2.uid,
          title: '📢 تمت الموافقة على إعلان',
          body: `${admin.adm_name} وافق على الإعلان "${this.title}"`,
          type: 'system',
          link: `/admin/client-ads/${this.#id}`,
        }).send()
      )
    );
  }

  // ✅ رفض الإعلان مع ملاحظة
  async rejectAd(reason = '') {
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: 'rejected',
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason || null,
    };
    await this.update(updates);

    const notif = new Notification({
      receiver_id: this.userId,
      title: 'تم رفض إعلانك',
      body: `تم رفض إعلانك "${this.title}". السبب: ${reason || 'غير مذكور'}`,
      type: 'system',
      link: `/client/ads/${this.#id}`,
    });
    await notif.send();

    const otherAdmins = (await User.getAllUsersByType('admin')).filter(
      (a) => a.uid !== admin.uid
    );
    await Promise.all(
      otherAdmins.map((admin2) =>
        new Notification({
          receiver_id: admin2.uid,
          title: '❌ تم رفض إعلان',
          body: `${admin.adm_name} رفض الإعلان "${this.title}"\n📝 السبب: ${reason}`,
          type: 'system',
          link: `/admin/client-ads/${this.#id}`,
        }).send()
      )
    );
  }

  // ✅ إعادة الإعلان لحالة المراجعة
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

    const notif = new Notification({
      receiver_id: this.userId,
      title: 'إعلانك الآن تحت المراجعة',
      body: `تمت إعادة إعلانك "${this.title}" لحالة المراجعة من قبل الأدمن.`,
      type: 'system',
      link: `/client/ads/${this.#id}`,
    });
    await notif.send();

    const otherAdmins = (await User.getAllUsersByType('admin')).filter(
      (a) => a.uid !== admin.uid
    );
    await Promise.all(
      otherAdmins.map((admin2) =>
        new Notification({
          receiver_id: admin2.uid,
          title: '🔁 إعادة إعلان إلى المراجعة',
          body: `${admin.adm_name} أعاد الإعلان "${this.title}" إلى حالة المراجعة`,
          type: 'system',
          link: `/admin/client-ads/${this.#id}`,
        }).send()
      )
    );
  }

  // ✅ تحديث حالة العرض (status)
  async updateStatus(newStatus) {
    const validStatuses = ['تحت العرض', 'تحت التفاوض', 'منتهي'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error('⚠️ حالة غير صالحة للإعلان');
    }
    this.status = newStatus;
    await this.update({ status: newStatus });
  }

  // ✅ جلب إعلان حسب ID
  static async getById(id) {
    const docRef = doc(db, 'ClientAdvertisements', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return await ClientAdvertisement.#handleExpiry(snapshot.data());
    }
    return null;
  }

  // ✅ جلب جميع الإعلانات
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

  // ✅ جلب حسب حالة reviewStatus (pending, approved, rejected)
  static async getByReviewStatus(status) {
    const q = query(
      collection(db, 'ClientAdvertisements'),
      where('reviewStatus', '==', status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap) => new ClientAdvertisement(docSnap.data())
    );
  }

  // ✅ جلب حسب حالة العرض (status)
  static async getByAdStatus(status) {
    const q = query(
      collection(db, 'ClientAdvertisements'),
      where('status', '==', status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap) => new ClientAdvertisement(docSnap.data())
    );
  }

  // ✅ الاشتراك اللحظي في الإعلانات حسب حالة المراجعة (pending, approved, rejected)
  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, 'ClientAdvertisements'),
      where('reviewStatus', '==', status)
    );
    return onSnapshot(q, (querySnapshot) => {
      const ads = querySnapshot.docs.map(
        (docSnap) => new ClientAdvertisement(docSnap.data())
      );
      callback(ads);
    });
  }

  // ✅ الاشتراك اللحظي في الإعلانات المفعّلة
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

  // ✅ معالجة انتهاء مدة الإعلان
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

  // ✅ رفع صور الإعلان
  async #uploadImages(files = []) {
    const storage = getStorage();
    const imageUrls = [];
    const limitedFiles = files.slice(0, 4);
    for (let i = 0; i < limitedFiles.length; i++) {
      const file = limitedFiles[i];
      const imageRef = ref(
        storage,
        `client_ads/${this.#id}/image_${i + 1}.jpg`
      );
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  }

  // ✅ حذف جميع الصور
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

  // ✅ رفع إيصال الدفع
  async #uploadReceipt(file) {
    const storage = getStorage();
    const receiptRef = ref(storage, `client_ads/${this.#id}/receipt.jpg`);
    await uploadBytes(receiptRef, file);
    return await getDownloadURL(receiptRef);
  }

  // ✅ حذف إيصال الدفع
  async #deleteReceipt() {
    const storage = getStorage();
    const receiptRef = ref(storage, `client_ads/${this.#id}/receipt.jpg`);
    try {
      await deleteObject(receiptRef);
    } catch (err) {
      console.warn('⚠️ فشل حذف إيصال الدفع:', err.message);
    }
  }

  // ✅ البيانات الخام للحفظ في Firestore
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
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
      reviewStatus: this.reviewStatus,
      status: this.status,
      receipt_image: this.receipt_image,
    };
  }
}

export default ClientAdvertisement;
