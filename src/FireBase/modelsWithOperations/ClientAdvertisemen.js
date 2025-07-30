// import {
//   collection,
//   addDoc,
//   doc,
//   getDoc,
//   deleteDoc,
//   updateDoc,
//   getDocs,
//   query,
//   where,
//   onSnapshot,
// } from 'firebase/firestore';
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
//   listAll,
// } from 'firebase/storage';
// import { db, auth } from '../firebaseConfig';
// import Notification from '../MessageAndNotification/Notification';
// import User from './User';

// console.log('ClientAdvertisemen.js loaded');

// // أضف هذا الكائن الثابت بعد الاستيرادات
// const PACKAGE_INFO = {
//   1: { name: 'باقة الأساس', price: 'مجانا', duration: 7 },
//   2: { name: 'باقة النخبة', price: 50, duration: 14 },
//   3: { name: 'باقة التميز', price: 100, duration: 21 },
// };

// class ClientAdvertisement {
//   #id = null;

//   constructor(data) {
//     this.#id = data.id || null;
//     this.title = data.title ||"ad  you have submited"
//     this.type = data.type;
//     this.price = data.price;
//     this.area = data.area;
//     this.date_of_building = data.date_of_building;
//     this.images = data.images || [];
//     this.location = data.location;
//     this.address = data.address;
//     this.city = data.city;
//     this.governorate = data.governorate;
//     this.phone = data.phone;
//     this.user_name = data.user_name;
//     this.userId = data.userId || auth.currentUser?.uid || null; // التأكد من userId
//     this.ad_type = data.ad_type || 'بيع';
//     this.ad_status = data.ad_status || 'pending';
//     this.type_of_user = data.type_of_user || 'client';
//     this.ads = data.ads !== undefined ? data.ads : false;
//     this.adExpiryTime = data.adExpiryTime || null;
//     this.description = data.description;
//     this.reviewed_by = data.reviewed_by || null;
//     this.review_note = data.review_note || null;
//     this.reviewStatus = data.reviewStatus || 'pending';
//     this.status = data.status || 'تحت العرض';
//     this.receipt_image = data.receipt_image || null;
//     this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
//   }

//   get id() {
//     return this.#id;
//   }

//   async save(imageFiles = [], receiptFile = null) {
//     console.log('Receipt file in save:', receiptFile);
//     const colRef = collection(db, 'ClientAdvertisements');
//     // تجهيز معلومات الباقة
//     let adPackageName = null, adPackagePrice = null, adPackageDuration = null;
//     const pkgKey = String(this.adPackage);
//     if (pkgKey && PACKAGE_INFO[pkgKey]) {
//       adPackageName = PACKAGE_INFO[pkgKey].name;
//       adPackagePrice = PACKAGE_INFO[pkgKey].price;
//       adPackageDuration = PACKAGE_INFO[pkgKey].duration;
//     }
//     const docRef = await addDoc(colRef, {
//       ...this.#getAdData(),
//       adPackageName,
//       adPackagePrice,
//       adPackageDuration,
//     });
//     this.#id = docRef.id;
//     await updateDoc(docRef, { id: this.#id });

//     if (imageFiles.length > 0) {
//       const urls = await this.#uploadImages(imageFiles);
//       this.images = urls;
//       await updateDoc(docRef, { images: urls });
//     }

//     // لوج للتشخيص
//     console.log('Receipt file in save:', receiptFile);

//     if (receiptFile) {
//       const receiptUrl = await this.#uploadReceipt(receiptFile);
//       this.receipt_image = receiptUrl;
//       await updateDoc(docRef, { receipt_image: receiptUrl });
//       console.log('Receipt image saved in Firestore:', receiptUrl);
//     }

//     const admins = await User.getAllUsersByType('admin');
//     await Promise.all(
//       admins.map((admin) => {
//         const notif = new Notification({
//           receiver_id: admin.uid,
//           title: 'إعلان جديد بانتظار المراجعة',
//           body: `العنوان: ${this.title}`,
//           type: 'system',
//           link: `/admin/client-ads/${this.#id}`,
//         });
//         return notif.send();
//       })
//     );

//     return this.#id;
//   }

//   async update(updates = {}, newImageFiles = null, newReceiptFile = null) {
//     if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
//     const docRef = doc(db, 'ClientAdvertisements', this.#id);

//     if (newImageFiles && newImageFiles.length > 0) {
//       await this.#deleteAllImages();
//       const newUrls = await this.#uploadImages(newImageFiles);
//       updates.images = newUrls;
//       this.images = newUrls;
//     }

//     if (newReceiptFile) {
//       const newReceiptUrl = await this.#uploadReceipt(newReceiptFile);
//       updates.receipt_image = newReceiptUrl;
//       this.receipt_image = newReceiptUrl;
//     }

//     // تحديث معلومات الباقة إذا تم تغييرها
//     if (typeof updates.adPackage !== 'undefined' && updates.adPackage !== null) {
//       const pkgKey = String(updates.adPackage);
//       if (PACKAGE_INFO[pkgKey]) {
//         updates.adPackageName = PACKAGE_INFO[pkgKey].name;
//         updates.adPackagePrice = PACKAGE_INFO[pkgKey].price;
//         updates.adPackageDuration = PACKAGE_INFO[pkgKey].duration;
//       } else {
//         updates.adPackageName = null;
//         updates.adPackagePrice = null;
//         updates.adPackageDuration = null;
//       }
//     }

//     await updateDoc(docRef, updates);
//   }

//   async delete() {
//     if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
//     await this.#deleteAllImages();
//     await this.#deleteReceipt();
//     const docRef = doc(db, 'ClientAdvertisements', this.#id);
//     await deleteDoc(docRef);
//   }

//   async adsActivation(days) {
//     if (!this.#id) throw new Error('الإعلان بدون ID لتفعيله');
//     const ms = days * 24 * 60 * 60 * 1000;
//     this.ads = true;
//     this.adExpiryTime = Date.now() + ms;
//     await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
//     setTimeout(() => this.removeAds().catch(console.error), ms);
//   }

//   async removeAds() {
//     if (!this.#id) throw new Error('الإعلان بدون ID لإيقافه');
//     this.ads = false;
//     this.adExpiryTime = null;
//     await this.update({ ads: false, adExpiryTime: null });
//   }

// async approveAd() {
//   if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كأدمن للموافقة');
//   const admin = await User.getByUid(auth.currentUser.uid);
//   const updates = {
//     reviewStatus: 'approved',
//     reviewed_by: {
//       uid: admin.uid,
//       name: admin.adm_name,
//       image: admin.image || null,
//     },
//     review_note: null,
//   };
//   await this.update(updates);

//   if (!this.userId) {
//     console.warn('[DEBUG] لا يوجد userId للإعلان:', this.#id);
//     return;
//   }
//   const userRef = doc(db, 'users', this.userId);
//   const userSnap = await getDoc(userRef);
//   if (!userSnap.exists()) {
//     console.warn('[DEBUG] المستخدم غير موجود في قاعدة البيانات:', this.userId);
//     return;
//   }
//   try {
//     const notif = new Notification({
//       receiver_id: this.userId,
//       title: '📢 تمت الموافقة على إعلانك',
//       body: `${admin.adm_name || 'الأدمن'} وافق على الإعلان `,
//       type: 'system',
//       link: `/`,
//     });
//     await notif.send();
//     console.log('[DEBUG] تم إرسال إشعار الموافقة إلى userId:', this.userId);
//   } catch (error) {
//     console.warn('[DEBUG] فشل إرسال إشعار الموافقة:', {
//       errorMessage: error.message,
//       userId: this.userId,
//       adId: this.#id,
//     });
//   }
//   try {
//     const otherAdmins = (await User.getAllUsersByType('admin')).filter(
//       (a) => a.uid !== admin.uid
//     );
//     await Promise.all(
//       otherAdmins.map((admin2) =>
//         new Notification({
//           receiver_id: admin2.uid,
//           title: '📢 تمت الموافقة على إعلان',
//           body: `${admin.adm_name} وافق على الإعلان `,
//           type: 'system',
//           link: `/`,
//         }).send()
//       )
//     );
//   } catch (error) {
//     console.warn('[DEBUG] فشل إرسال إشعارات للأدمنز الآخرين:', error);
//   }
// }

//   async rejectAd(reason = '') {
//     if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كأدمن للرفض');
//     const admin = await User.getByUid(auth.currentUser.uid);
//     const updates = {
//       reviewStatus: 'rejected',
//       reviewed_by: {
//         uid: admin.uid,
//         name: admin.adm_name,
//         image: admin.image || null,
//       },
//       review_note: reason || null,
//     };
//     await this.update(updates);

//     if (this.userId) {
//       try {
//         const notif = new Notification({
//           receiver_id: this.userId,
//           title: 'تم رفض إعلانك',
//           body: `تم رفض إعلانك "${this.title}". السبب: ${reason || 'غير مذكور'}`,
//           type: 'system',
//           link: `/client/ads/${this.#id}`,
//         });
//         await notif.send();
//         console.log('[DEBUG] تم إرسال إشعار الرفض إلى userId:', this.userId);
//       } catch (error) {
//         console.warn('[DEBUG] فشل إرسال إشعار الرفض:', error);
//       }
//     }

//     try {
//       const otherAdmins = (await User.getAllUsersByType('admin')).filter(
//         (a) => a.uid !== admin.uid
//       );
//       await Promise.all(
//         otherAdmins.map((admin2) =>
//           new Notification({
//             receiver_id: admin2.uid,
//             title: '❌ تم رفض إعلان',
//             body: `${admin.adm_name} رفض الإعلان "${this.title}"\n📝 السبب: ${reason}`,
//             type: 'system',
//             link: `/admin/client-ads/${this.#id}`,
//           }).send()
//         )
//       );
//     } catch (error) {
//       console.warn('[DEBUG] فشل إرسال إشعارات للأدمنز الآخرين:', error);
//     }
//   }

//   async returnToPending() {
//     if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كأدمن');
//     const admin = await User.getByUid(auth.currentUser.uid);
//     const updates = {
//       reviewStatus: 'pending',
//       reviewed_by: {
//         uid: admin.uid,
//         name: admin.adm_name,
//         image: admin.image || null,
//       },
//       review_note: null,
//     };
//     await this.update(updates);

//     if (this.userId) {
//       try {
//         const notif = new Notification({
//           receiver_id: this.userId,
//           title: 'إعلانك الآن تحت المراجعة',
//           body: `تمت إعادة إعلانك "${this.title}" لحالة المراجعة من قبل الأدمن.`,
//           type: 'system',
//           link: `/client/ads/${this.#id}`,
//         });
//         await notif.send();
//         console.log('[DEBUG] تم إرسال إشعار إعادة المراجعة إلى userId:', this.userId);
//       } catch (error) {
//         console.warn('[DEBUG] فشل إرسال إشعار إعادة المراجعة:', error);
//       }
//     }

//     try {
//       const otherAdmins = (await User.getAllUsersByType('admin')).filter(
//         (a) => a.uid !== admin.uid
//       );
//       await Promise.all(
//         otherAdmins.map((admin2) =>
//           new Notification({
//             receiver_id: admin2.uid,
//             title: '🔁 إعادة إعلان إلى المراجعة',
//             body: `${admin.adm_name} أعاد الإعلان "${this.title}" إلى حالة المراجعة`,
//             type: 'system',
//             link: `/admin/client-ads/${this.#id}`,
//           }).send()
//         )
//       );
//     } catch (error) {
//       console.warn('[DEBUG] فشل إرسال إشعارات للأدمنز الآخرين:', error);
//     }
//   }

//   async clientReturnToPending() {
//     const updates = {
//       reviewStatus: 'pending',
//       reviewed_by: null,
//       review_note: null,
//     };
//     await this.update(updates);

//     try {
//       const admins = await User.getAllUsersByType('admin');
//       await Promise.all(
//         admins.map((admin) =>
//           new Notification({
//             receiver_id: admin.uid,
//             title: '🔄 إعلان جديد تحتاج مراجعة',
//             body: `العميل ${this.user_name} أعاد إعلانه "${this.title}" إلى حالة المراجعة`,
//             type: 'system',
//             link: `/admin/client-ads/${this.#id}`,
//           }).send()
//         )
//       );
//     } catch (error) {
//       console.warn('[DEBUG] فشل إرسال إشعارات للأدمنز:', error);
//     }
//   }

//   async updateStatus(newStatus) {
//     const validStatuses = ['تحت العرض', 'تحت التفاوض', 'منتهي'];
//     if (!validStatuses.includes(newStatus)) {
//       throw new Error('⚠️ حالة غير صالحة للإعلان');
//     }
//     this.status = newStatus;
//     await this.update({ status: newStatus });
//   }

//   static async getById(id) {
//     const docRef = doc(db, 'ClientAdvertisements', id);
//     const snapshot = await getDoc(docRef);
//     if (snapshot.exists()) {
//       return await ClientAdvertisement.#handleExpiry(snapshot.data());
//     }
//     return null;
//   }

//   static async getAll() {
//     const colRef = collection(db, 'ClientAdvertisements');
//     const snapshot = await getDocs(colRef);
//     const ads = [];
//     for (const docSnap of snapshot.docs) {
//       const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
//       if (ad) ads.push(ad);
//     }
//     return ads;
//   }

//   static async getByReviewStatus(status) {
//     const q = query(
//       collection(db, 'ClientAdvertisements'),
//       where('reviewStatus', '==', status)
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(
//       (docSnap) => new ClientAdvertisement(docSnap.data())
//     );
//   }

//   static async getByAdStatus(status) {
//     const q = query(
//       collection(db, 'ClientAdvertisements'),
//       where('status', '==', status)
//     );
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(
//       (docSnap) => new ClientAdvertisement(docSnap.data())
//     );
//   }

//   static async getByUserId(userId) {
//     const q = query(
//       collection(db, 'ClientAdvertisements'),
//       where('userId', '==', userId)
//     );
//     const snapshot = await getDocs(q);
//     const ads = [];
//     for (const docSnap of snapshot.docs) {
//       const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
//       if (ad) ads.push(ad);
//     }
//     return ads;
//   }

//   static subscribeByStatus(status, callback) {
//     const q = query(
//       collection(db, 'ClientAdvertisements'),
//       where('reviewStatus', '==', status)
//     );
//     return onSnapshot(q, (querySnapshot) => {
//       const ads = querySnapshot.docs.map(
//         (docSnap) => new ClientAdvertisement(docSnap.data())
//       );
//       callback(ads);
//     });
//   }

//   static subscribeActiveAds(callback) {
//     const colRef = collection(db, 'ClientAdvertisements');
//     const q = query(colRef, where('ads', '==', true));
//     return onSnapshot(q, async (querySnapshot) => {
//       const ads = [];
//       for (const docSnap of querySnapshot.docs) {
//         const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
//         if (ad) ads.push(ad);
//       }
//       callback(ads);
//     });
//   }

//   static async #handleExpiry(data) {
//     const now = Date.now();
//     if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
//       data.ads = false;
//       data.adExpiryTime = null;
//       const docRef = doc(db, 'ClientAdvertisements', data.id);
//       await updateDoc(docRef, { ads: false, adExpiryTime: null });
//     }
//     return new ClientAdvertisement(data);
//   }

//   async #uploadImages(files = []) {
//     const storage = getStorage();
//     const imageUrls = [];
//     const limitedFiles = files.slice(0, 4);
//     for (let i = 0; i < limitedFiles.length; i++) {
//       const file = limitedFiles[i];
//       const imageRef = ref(
//         storage,
//         `property_images/${this.userId}/${Date.now()}_${file.name}`
//       );
//       await uploadBytes(imageRef, file);
//       const url = await getDownloadURL(imageRef);
//       imageUrls.push(url);
//     }
//     return imageUrls;
//   }

//   async #deleteAllImages() {
//     const storage = getStorage();
//     const dirRef = ref(storage, `client_ads/${this.#id}`);
//     try {
//       const list = await listAll(dirRef);
//       for (const itemRef of list.items) {
//         await deleteObject(itemRef);
//       }
//     } catch (err) {
//       console.warn('⚠️ فشل حذف الصور:', err.message);
//     }
//   }

//   async #uploadReceipt(file) {
//     const storage = getStorage();
//     const path = `property_images/${this.userId}/receipt.jpg`;
//     console.log('Uploading receipt to:', path);
//     const receiptRef = ref(storage, path);
//     await uploadBytes(receiptRef, file);
//     const url = await getDownloadURL(receiptRef);
//     console.log('Receipt uploaded to:', url);
//     return url;
//   }

//   async #deleteReceipt() {
//     const storage = getStorage();
//     const receiptRef = ref(storage, `client_ads/${this.#id}/receipt.jpg`);
//     try {
//       await deleteObject(receiptRef);
//     } catch (err) {
//       console.warn('⚠️ فشل حذف إيصال الدفع:', err.message);
//     }
//   }

//   #getAdData() {
//     // تجهيز معلومات الباقة
//     let adPackageName = null, adPackagePrice = null, adPackageDuration = null;
//     const pkgKey = String(this.adPackage);
//     if (pkgKey && PACKAGE_INFO[pkgKey]) {
//       adPackageName = PACKAGE_INFO[pkgKey].name;
//       adPackagePrice = PACKAGE_INFO[pkgKey].price;
//       adPackageDuration = PACKAGE_INFO[pkgKey].duration;
//     }
//     return {
//       title: this.title,
//       type: this.type,
//       price: this.price,
//       area: this.area,
//       date_of_building: this.date_of_building,
//       images: this.images,
//       location: this.location,
//       address: this.address,
//       city: this.city,
//       governorate: this.governorate,
//       phone: this.phone,
//       user_name: this.user_name,
//       userId: this.userId,
//       ad_type: this.ad_type,
//       ad_status: this.ad_status,
//       type_of_user: this.type_of_user,
//       ads: this.ads,
//       adExpiryTime: this.adExpiryTime,
//       description: this.description,
//       reviewed_by: this.reviewed_by,
//       review_note: this.review_note,
//       reviewStatus: this.reviewStatus,
//       status: this.status,
//       receipt_image: this.receipt_image,
//       ...(this.adPackage !== undefined && this.adPackage !== null ? { adPackage: this.adPackage } : {}),
//       adPackageName,
//       adPackagePrice,
//       adPackageDuration,
//     };
//   }
// }

// export default ClientAdvertisement;

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
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { db, auth } from "../firebaseConfig";
import Notification from "../MessageAndNotification/Notification";
import User from "./User";

console.log("ClientAdvertisement.js loaded");

// Package information
const PACKAGE_INFO = {
  1: { name: "باقة الأساس", price: "مجانا", duration: 7 },
  2: { name: "باقة النخبة", price: 50, duration: 14 },
  3: { name: "باقة التميز", price: 100, duration: 21 },
};

class ClientAdvertisement {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.title = data.title || "ad you have submitted";
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
    this.userId = data.userId || auth.currentUser?.uid || null;
    this.ad_type = data.ad_type || "بيع";
    this.ad_status = data.ad_status || "pending";
    this.type_of_user = data.type_of_user || "client";
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.description = data.description;
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.reviewStatus = data.reviewStatus || "pending";
    this.status = data.status || "تحت العرض";
    this.receipt_image = data.receipt_image || null;
    this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
  }

  get id() {
    return this.#id;
  }

  async save(imageUrls = [], receiptUrl = null) {
    console.log(
      "[DEBUG] save called with imageUrls:",
      imageUrls,
      "receiptUrl:",
      receiptUrl
    );
    const colRef = collection(db, "ClientAdvertisements");
    // Package information
    let adPackageName = null,
      adPackagePrice = null,
      adPackageDuration = null;
    const pkgKey = String(this.adPackage);
    if (pkgKey && PACKAGE_INFO[pkgKey]) {
      adPackageName = PACKAGE_INFO[pkgKey].name;
      adPackagePrice = PACKAGE_INFO[pkgKey].price;
      adPackageDuration = PACKAGE_INFO[pkgKey].duration;
    }
    const docRef = await addDoc(colRef, {
      ...this.#getAdData(),
      adPackageName,
      adPackagePrice,
      adPackageDuration,
      images: imageUrls,
      receipt_image: receiptUrl,
    });
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    this.images = imageUrls;
    this.receipt_image = receiptUrl;

    const admins = await User.getAllUsersByType("admin");
    await Promise.all(
      admins.map((admin) => {
        const notif = new Notification({
          receiver_id: admin.uid,
          title: "إعلان جديد بانتظار المراجعة",
          body: `العنوان: ${this.title}`,
          type: "system",
          link: `/admin/client-ads/${this.#id}`,
        });
        return notif.send();
      })
    );

    return this.#id;
  }

  async update(updates = {}, receiptUrl = null) {
    if (!this.#id) throw new Error("الإعلان بدون ID صالح للتحديث");
    const docRef = doc(db, "ClientAdvertisements", this.#id);

    // Handle images from updates or keep existing
    const updatedImages = updates.images || this.images;
    this.images = updatedImages;

    // Handle receipt URL
    if (receiptUrl !== null) {
      this.receipt_image = receiptUrl;
      updates.receipt_image = receiptUrl;
    }

    // Update package information if provided
    if (
      typeof updates.adPackage !== "undefined" &&
      updates.adPackage !== null
    ) {
      const pkgKey = String(updates.adPackage);
      if (PACKAGE_INFO[pkgKey]) {
        updates.adPackageName = PACKAGE_INFO[pkgKey].name;
        updates.adPackagePrice = PACKAGE_INFO[pkgKey].price;
        updates.adPackageDuration = PACKAGE_INFO[pkgKey].duration;
      } else {
        updates.adPackageName = null;
        updates.adPackagePrice = null;
        updates.adPackageDuration = null;
      }
    }

    await updateDoc(docRef, {
      ...updates,
      images: updatedImages,
      receipt_image: this.receipt_image,
    });
  }

  async delete() {
    if (!this.#id) throw new Error("الإعلان بدون ID صالح للحذف");
    await this.deleteAllImages();
    await this.#deleteReceipt();
    const docRef = doc(db, "ClientAdvertisements", this.#id);
    await deleteDoc(docRef);
  }

  async adsActivation(days) {
    if (!this.#id) throw new Error("الإعلان بدون ID لتفعيله");
    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  async removeAds() {
    if (!this.#id) throw new Error("الإعلان بدون ID لإيقافه");
    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  async approveAd() {
    if (!auth.currentUser) throw new Error("يجب تسجيل الدخول كأدمن للموافقة");
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: "approved",
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    };
    await this.update(updates);

    if (!this.userId) {
      console.warn("[DEBUG] لا يوجد userId للإعلان:", this.#id);
      return;
    }
    const userRef = doc(db, "users", this.userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.warn(
        "[DEBUG] المستخدم غير موجود في قاعدة البيانات:",
        this.userId
      );
      return;
    }
    try {
      const notif = new Notification({
        receiver_id: this.userId,
        title: "📢 تمت الموافقة على إعلانك",
        body: `${admin.adm_name || "الأدمن"} وافق على الإعلان`,
        type: "system",
        link: `/`,
      });
      await notif.send();
      console.log("[DEBUG] تم إرسال إشعار الموافقة إلى userId:", this.userId);
    } catch (error) {
      console.warn("[DEBUG] فشل إرسال إشعار الموافقة:", {
        errorMessage: error.message,
        userId: this.userId,
        adId: this.#id,
      });
    }
    try {
      const otherAdmins = (await User.getAllUsersByType("admin")).filter(
        (a) => a.uid !== admin.uid
      );
      await Promise.all(
        otherAdmins.map((admin2) =>
          new Notification({
            receiver_id: admin2.uid,
            title: "📢 تمت الموافقة على إعلان",
            body: `${admin.adm_name} وافق على الإعلان`,
            type: "system",
            link: `/`,
          }).send()
        )
      );
    } catch (error) {
      console.warn("[DEBUG] فشل إرسال إشعارات للأدمنز الآخرين:", error);
    }
  }

  async rejectAd(reason = "") {
    if (!auth.currentUser) throw new Error("يجب تسجيل الدخول كأدمن للرفض");
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: "rejected",
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason || null,
    };
    await this.update(updates);

    if (this.userId) {
      try {
        const notif = new Notification({
          receiver_id: this.userId,
          title: "تم رفض إعلانك",
          body: `تم رفض إعلانك "${this.title}". السبب: ${
            reason || "غير مذكور"
          }`,
          type: "system",
          link: `/client/ads/${this.#id}`,
        });
        await notif.send();
        console.log("[DEBUG] تم إرسال إشعار الرفض إلى userId:", this.userId);
      } catch (error) {
        console.warn("[DEBUG] فشل إرسال إشعار الرفض:", error);
      }
    }

    try {
      const otherAdmins = (await User.getAllUsersByType("admin")).filter(
        (a) => a.uid !== admin.uid
      );
      await Promise.all(
        otherAdmins.map((admin2) =>
          new Notification({
            receiver_id: admin2.uid,
            title: "❌ تم رفض إعلان",
            body: `${admin.adm_name} رفض الإعلان "${this.title}"\n📝 السبب: ${reason}`,
            type: "system",
            link: `/admin/client-ads/${this.#id}`,
          }).send()
        )
      );
    } catch (error) {
      console.warn("[DEBUG] فشل إرسال إشعارات للأدمنز الآخرين:", error);
    }
  }

  async returnToPending() {
    if (!auth.currentUser) throw new Error("يجب تسجيل الدخول كأدمن");
    const admin = await User.getByUid(auth.currentUser.uid);
    const updates = {
      reviewStatus: "pending",
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    };
    await this.update(updates);

    if (this.userId) {
      try {
        const notif = new Notification({
          receiver_id: this.userId,
          title: "إعلانك الآن تحت المراجعة",
          body: `تمت إعادة إعلانك "${this.title}" لحالة المراجعة من قبل الأدمن.`,
          type: "system",
          link: `/client/ads/${this.#id}`,
        });
        await notif.send();
        console.log(
          "[DEBUG] تم إرسال إشعار إعادة المراجعة إلى userId:",
          this.userId
        );
      } catch (error) {
        console.warn("[DEBUG] فشل إرسال إشعار إعادة المراجعة:", error);
      }
    }

    try {
      const otherAdmins = (await User.getAllUsersByType("admin")).filter(
        (a) => a.uid !== admin.uid
      );
      await Promise.all(
        otherAdmins.map((admin2) =>
          new Notification({
            receiver_id: admin2.uid,
            title: "🔁 إعادة إعلان إلى المراجعة",
            body: `${admin.adm_name} أعاد الإعلان "${this.title}" إلى حالة المراجعة`,
            type: "system",
            link: `/admin/client-ads/${this.#id}`,
          }).send()
        )
      );
    } catch (error) {
      console.warn("[DEBUG] فشل إرسال إشعارات للأدمنز الآخرين:", error);
    }
  }

  async clientReturnToPending() {
    const updates = {
      reviewStatus: "pending",
      reviewed_by: null,
      review_note: null,
    };
    await this.update(updates);

    try {
      const admins = await User.getAllUsersByType("admin");
      await Promise.all(
        admins.map((admin) =>
          new Notification({
            receiver_id: admin.uid,
            title: "🔄 إعلان جديد تحتاج مراجعة",
            body: `العميل ${this.user_name} أعاد إعلانه "${this.title}" إلى حالة المراجعة`,
            type: "system",
            link: `/admin/client-ads/${this.#id}`,
          }).send()
        )
      );
    } catch (error) {
      console.warn("[DEBUG] فشل إرسال إشعارات للأدمنز:", error);
    }
  }

  async updateStatus(newStatus) {
    const validStatuses = ["تحت العرض", "تحت التفاوض", "منتهي"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("⚠️ حالة غير صالحة للإعلان");
    }
    this.status = newStatus;
    await this.update({ status: newStatus });
  }

  static async getById(id) {
  const docRef = doc(db, 'ClientAdvertisements', id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = await ClientAdvertisement.#handleExpiry(snapshot.data());
    return { ...data, id }; // ✅ لازم ترجع id هنا
  }
  return null;
}


  static async getAll() {
    const colRef = collection(db, "ClientAdvertisements");
    const snapshot = await getDocs(colRef);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  static async getByReviewStatus(status) {
    const q = query(
      collection(db, "ClientAdvertisements"),
      where("reviewStatus", "==", status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap) => new ClientAdvertisement(docSnap.data())
    );
  }

  static async getByAdStatus(status) {
    const q = query(
      collection(db, "ClientAdvertisements"),
      where("status", "==", status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (docSnap) => new ClientAdvertisement(docSnap.data())
    );
  }

  static async getByUserId(userId) {
    const q = query(
      collection(db, "ClientAdvertisements"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const ads = [];
    for (const docSnap of snapshot.docs) {
      const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
      if (ad) ads.push(ad);
    }
    return ads;
  }

  static subscribeByStatus(status, callback) {
    const q = query(
      collection(db, "ClientAdvertisements"),
      where("reviewStatus", "==", status)
    );
    return onSnapshot(q, (querySnapshot) => {
      const ads = querySnapshot.docs.map(
        (docSnap) => new ClientAdvertisement(docSnap.data())
      );
      callback(ads);
    });
  }

  static subscribeActiveAds(callback) {
    const colRef = collection(db, "ClientAdvertisements");
    const q = query(colRef, where("ads", "==", true));
    return onSnapshot(q, async (querySnapshot) => {
      const ads = [];
      for (const docSnap of querySnapshot.docs) {
        const ad = await ClientAdvertisement.#handleExpiry(docSnap.data());
        if (ad) ads.push(ad);
      }
      callback(ads);
    });
  }

  static async #handleExpiry(data) {
    const now = Date.now();
    if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
      data.ads = false;
      data.adExpiryTime = null;
      const docRef = doc(db, "ClientAdvertisements", data.id);
      await updateDoc(docRef, { ads: false, adExpiryTime: null });
    }
    return new ClientAdvertisement(data);
  }

  async uploadImages(files = []) {
    const storage = getStorage();
    const imageUrls = [];
    const limitedFiles = files.slice(0, 4);
    for (let i = 0; i < limitedFiles.length; i++) {
      const file = limitedFiles[i];
      const imageRef = ref(
        storage,
        `property_images/${this.userId}/${Date.now()}_${file.name}`
      );
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      imageUrls.push(url);
    }
    return imageUrls;
  }

  async deleteAllImages() {
    const storage = getStorage();
    const dirRef = ref(storage, `property_images/${this.userId}`);
    try {
      const list = await listAll(dirRef);
      for (const itemRef of list.items) {
        await deleteObject(itemRef);
      }
    } catch (err) {
      console.warn("[DEBUG] فشل حذف الصور:", err.message);
    }
  }

  async uploadReceipt(file, adId) {
    const storage = getStorage();
    const path = `property_images/${this.userId}/${adId}_receipt.jpg`;
    console.log("[DEBUG] Uploading receipt to:", path);
    const receiptRef = ref(storage, path);
    await uploadBytes(receiptRef, file);
    const url = await getDownloadURL(receiptRef);
    console.log("[DEBUG] Receipt uploaded to:", url);
    return url;
  }

  async #deleteReceipt() {
    const storage = getStorage();
    const receiptRef = ref(
      storage,
      `property_images/${this.userId}/${this.#id}_receipt.jpg`
    );
    try {
      await deleteObject(receiptRef);
    } catch (err) {
      console.warn("[DEBUG] فشل حذف إيصال الدفع:", err.message);
    }
  }

  #getAdData() {
    let adPackageName = null,
      adPackagePrice = null,
      adPackageDuration = null;
    const pkgKey = String(this.adPackage);
    if (pkgKey && PACKAGE_INFO[pkgKey]) {
      adPackageName = PACKAGE_INFO[pkgKey].name;
      adPackagePrice = PACKAGE_INFO[pkgKey].price;
      adPackageDuration = PACKAGE_INFO[pkgKey].duration;
    }
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
      ...(this.adPackage !== undefined && this.adPackage !== null
        ? { adPackage: this.adPackage }
        : {}),
      adPackageName,
      adPackagePrice,
      adPackageDuration,
    };
  }
}

export default ClientAdvertisement;
