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

// أضف هذا الكائن الثابت في أعلى الملف بعد الاستيرادات
const PACKAGE_INFO = {
  1: { name: "باقة الأساس", price: 100, duration: 7 },
  2: { name: "باقة النخبة", price: 150, duration: 14 },
  3: { name: "باقة التميز", price: 200, duration: 21 },
};

class RealEstateDeveloperAdvertisement {
  #id = null;

  constructor(data, skipAuthCheck = false) {
    // التحقق من حالة تسجيل الدخول (إلا إذا تم تخطي التحقق)
    if (!skipAuthCheck) {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("يجب تسجيل الدخول أولاً قبل إنشاء عقار جديد");
      }
    }

    this.#id = data.id || null;
    if (!this.#id) {
      console.error(
        "RealEstateDeveloperAdvertisement: id is missing in constructor data:",
        data
      );
    }
    this.developer_name = data.developer_name;
    this.description = data.description;
    this.project_types = data.project_types;
    this.images = data.images || [];
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
    this.status = data.status || "تحت العرض";
    this.paymentMethod = data.paymentMethod || null;
    this.negotiable = data.negotiable || false;
    this.deliveryTerms = data.deliveryTerms || null;
    this.features = data.features || [];
    this.area = data.area || null;
    this.ads = data.ads !== undefined ? data.ads : false;
    this.adExpiryTime = data.adExpiryTime || null;
    this.receipt_image = data.receipt_image || null;
    this.reviewStatus = data.reviewStatus || "pending";
    this.reviewed_by = data.reviewed_by || null;
    this.review_note = data.review_note || null;
    this.adPackage = data.adPackage !== undefined ? data.adPackage : null;
    // Add timestamp fields for analytics
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // ✅ getter للـ ID
  get id() {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل الوصول لمعرف العقار");
    }

    return this.#id;
  }

  // ✅ إنشاء إعلان جديد + رفع الصور + إيصال الدفع + إرسال إشعار للمشرف
  async save(imagesFiles = [], receiptFile = null) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل إضافة عقار");
    }

    console.log("Saving advertisement for user:", currentUser.uid);

    // Set creation timestamp
    this.createdAt = Date.now();
    this.updatedAt = Date.now();

    const colRef = collection(db, "RealEstateDeveloperAdvertisements");
    const docRef = await addDoc(colRef, this.#getAdData());
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });

    // إذا كانت الصور ملفات، قم برفعها
    if (imagesFiles.length > 0 && imagesFiles[0] instanceof File) {
      const imageUrls = await this.#uploadImages(imagesFiles);
      this.images = imageUrls;
      await updateDoc(docRef, { images: imageUrls });
    }
    // إذا كانت الصور روابط بالفعل، لا نحتاج لرفعها

    // رفع الريسيت بعد تعيين this.#id
    if (receiptFile) {
      // إذا كانت قيمة نصية (رابط قديم)، فقط خزّنها
      if (typeof receiptFile === "string") {
        this.receipt_image = receiptFile;
        await updateDoc(docRef, { receipt_image: receiptFile });
      } else {
        // وإلا اعتبرها ملفاً وارفعها تحت المسار المعياري /property_images/{userId}/{adId}/receipt.jpg
        const receiptUrl = await this.#uploadReceipt(receiptFile);
        this.receipt_image = receiptUrl;
        await updateDoc(docRef, { receipt_image: receiptUrl });
      }
    }

    const admins = await User.getAllUsersByType("admin");
    await Promise.all(
      admins.map((admin) =>
        new Notification({
          receiver_id: admin.uid,
          title: "إعلان مطور جديد بانتظار المراجعة",
          body: `المطور: ${this.developer_name}`,
          type: "system",
          link: `/admin/developer-ads/${this.#id}`,
        }).send()
      )
    );

    return this.#id;
  }

  // ✅ تحديث بيانات الإعلان + صور جديدة + إيصال جديد
  async update(updates = {}, newImagesFiles = null, newReceiptFile = null) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل تعديل العقار");
    }

    if (!this.#id) throw new Error("الإعلان بدون ID صالح للتحديث");
    const docRef = doc(db, "RealEstateDeveloperAdvertisements", this.#id);

    // تحديث معلومات الباقة إذا تم تغييرها
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

    // الصور
    if (newImagesFiles?.length > 0) {
      await this.#deleteAllImages();
      const newUrls = await this.#uploadImages(newImagesFiles);
      updates.images = newUrls;
      this.images = newUrls;
    } else if (typeof updates.images === "undefined") {
      // إذا لم يتم رفع صور جديدة ولم يتم تمرير images في التحديثات، احتفظ بالصور القديمة
      updates.images = this.images;
    }

    // إيصال الدفع
    if (newReceiptFile) {
      if (typeof newReceiptFile === "string") {
        updates.receipt_image = newReceiptFile;
        this.receipt_image = newReceiptFile;
      } else {
        const receiptUrl = await this.#uploadReceipt(newReceiptFile);
        updates.receipt_image = receiptUrl;
        this.receipt_image = receiptUrl;
      }
    }

    // تحقق من صحة الحالة
    if (updates.status && !["جاهز", "قيد الإنشاء"].includes(updates.status)) {
      throw new Error('❌ الحالة غير صالحة. اختر إما "جاهز" أو "قيد الإنشاء"');
    }

    // لا تغير userId إذا لم يتم تمريره أو كان فارغًا
    if (typeof updates.userId === "undefined" || !updates.userId) {
      updates.userId = this.userId;
    }

    await updateDoc(docRef, updates);
  }

  // ✅ حذف الإعلان بالكامل (من قاعدة البيانات + الصور)
  async delete() {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل حذف العقار");
    }

    if (!this.#id) throw new Error("الإعلان بدون ID");
    await this.#deleteAllImages();
    await this.#deleteReceipt();
    await deleteDoc(doc(db, "RealEstateDeveloperAdvertisements", this.#id));
  }

  // ✅ الموافقة على الإعلان
  async approve() {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل الموافقة على العقار");
    }

    const admin = await User.getByUid(currentUser.uid);
    await this.update({
      reviewStatus: "approved",
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });

    await new Notification({
      receiver_id: this.userId,
      title: "✅ تمت الموافقة على إعلانك العقاري",
      body: `تمت الموافقة على إعلانك "${this.developer_name}". يمكن للإدارة الآن تفعيله ليظهر في الواجهة.`,
      type: "system",
      link: `/client/developer-ads/${this.#id}`,
    }).send();
  }

  // ❌ رفض الإعلان
  async reject(reason = "") {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل رفض العقار");
    }

    const admin = await User.getByUid(currentUser.uid);
    await this.update({
      reviewStatus: "rejected",
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: reason,
    });

    await new Notification({
      receiver_id: this.userId,
      title: "❌ تم رفض إعلانك العقاري",
      body: `تم رفض إعلانك "${this.developer_name}". السبب: ${
        reason || "غير مذكور"
      }`,
      type: "system",
      link: `/client/developer-ads/${this.#id}`,
    }).send();
  }

  // 🔁 إعادة الإعلان لحالة "pending"
  async returnToPending() {
    const admin = await User.getByUid(auth.currentUser.uid);
    await this.update({
      reviewStatus: "pending",
      ads: false, // Deactivate the ad when returning to pending status
      adExpiryTime: null, // Reset expiry time when deactivating
      reviewed_by: {
        uid: admin.uid,
        name: admin.adm_name,
        image: admin.image || null,
      },
      review_note: null,
    });

    await new Notification({
      receiver_id: this.userId,
      title: "🔄 إعلانك الآن قيد المراجعة",
      body: `تمت إعادة إعلانك "${this.developer_name}" للمراجعة.`,
      type: "system",
      link: `/client/developer-ads/${this.#id}`,
    }).send();
  }

  // ⏳ تفعيل الإعلان لفترة معينة
  async adsActivation(days) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل تفعيل العقار");
    }

    const ms = days * 24 * 60 * 60 * 1000;
    this.ads = true;
    this.adExpiryTime = Date.now() + ms;
    await this.update({ ads: true, adExpiryTime: this.adExpiryTime });
    setTimeout(() => this.removeAds().catch(console.error), ms);
  }

  // ❌ إلغاء التفعيل
  async removeAds() {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل إلغاء تفعيل العقار");
    }

    this.ads = false;
    this.adExpiryTime = null;
    await this.update({ ads: false, adExpiryTime: null });
  }

  // 📥 جلب إعلان واحد بالـ ID (للمستخدمين المسجلين)
  static async getById(id) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل جلب بيانات العقار");
    }

    const docRef = doc(db, "RealEstateDeveloperAdvertisements", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const advertisement = new RealEstateDeveloperAdvertisement({
        ...data,
        id: snap.id, // إضافة الـ ID بشكل صريح
      });
      return advertisement;
    }
    return null;
  }

  // 📥 جلب إعلان واحد بالـ ID (للوصول العام - بدون تسجيل دخول)
  static async getByIdPublic(id) {
    const docRef = doc(db, "RealEstateDeveloperAdvertisements", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      // إرجاع object عادي بدلاً من instance من الكلاس لتجنب مشاكل المصادقة
      return {
        ...data,
        id: snap.id, // إضافة الـ ID بشكل صريح
      };
    }
    return null;
  }

  // 📥 جلب كل الإعلانات
  static async getAll() {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل جلب قائمة العقارات");
    }

    const snap = await getDocs(
      collection(db, "RealEstateDeveloperAdvertisements")
    );
    return snap.docs.map(
      (d) =>
        new RealEstateDeveloperAdvertisement({
          ...d.data(),
          id: d.id,
        })
    );
  }

  // 📥 جلب إعلانات حسب حالة المراجعة
  static async getByReviewStatus(status) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(
        "يجب تسجيل الدخول أولاً قبل جلب العقارات حسب حالة المراجعة"
      );
    }

    const q = query(
      collection(db, "RealEstateDeveloperAdvertisements"),
      where("reviewStatus", "==", status)
    );
    const snap = await getDocs(q);
    return snap.docs.map(
      (d) =>
        new RealEstateDeveloperAdvertisement({
          ...d.data(),
          id: d.id,
        })
    );
  }

  // 📥 جلب إعلانات مستخدم معين
  static async getByUserId(userId) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل جلب عقارات المستخدم");
    }

    const q = query(
      collection(db, "RealEstateDeveloperAdvertisements"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(
      (d) =>
        new RealEstateDeveloperAdvertisement({
          ...d.data(),
          id: d.id,
        })
    );
  }

  // ✅ الاشتراك اللحظي في الإعلانات حسب حالة المراجعة
  static subscribeByStatus(status, callback) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات");
    }

    const q = query(
      collection(db, "RealEstateDeveloperAdvertisements"),
      where("reviewStatus", "==", status)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          developer_name: data.developer_name,
          description: data.description,
          project_types: data.project_types,
          images: data.images || [],
          phone: data.phone,
          location: data.location,
          price_start_from: data.price_start_from,
          price_end_to: data.price_end_to,
          userId: data.userId,
          type_of_user: data.type_of_user,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          floor: data.floor,
          furnished: data.furnished,
          status: data.status,
          paymentMethod: data.paymentMethod,
          negotiable: data.negotiable,
          deliveryTerms: data.deliveryTerms,
          features: data.features || [],
          area: data.area,
          ads: data.ads !== undefined ? data.ads : false,
          adExpiryTime: data.adExpiryTime,
          receipt_image: data.receipt_image,
          reviewStatus: data.reviewStatus || "pending",
          reviewed_by: data.reviewed_by,
          review_note: data.review_note,
          adPackage: data.adPackage,
          adPackageName: data.adPackageName,
          adPackagePrice: data.adPackagePrice,
          adPackageDuration: data.adPackageDuration,
        };
      });
      callback(ads);
    });
  }

  // ✅ جلب الإعلانات المفعّلة فقط (ads=true AND reviewStatus='approved')
  static async getActiveAds() {
    // // التحقق من حالة تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل جلب العقارات المفعلة");
    // }

    const q = query(
      collection(db, "RealEstateDeveloperAdvertisements"),
      where("ads", "==", true),
      where("reviewStatus", "==", "approved")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        developer_name: data.developer_name,
        description: data.description,
        project_types: data.project_types,
        images: data.images || [],
        phone: data.phone,
        location: data.location,
        price_start_from: data.price_start_from,
        price_end_to: data.price_end_to,
        userId: data.userId,
        type_of_user: data.type_of_user,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        floor: data.floor,
        furnished: data.furnished,
        status: data.status,
        paymentMethod: data.paymentMethod,
        negotiable: data.negotiable,
        deliveryTerms: data.deliveryTerms,
        features: data.features || [],
        area: data.area,
        ads: data.ads !== undefined ? data.ads : false,
        adExpiryTime: data.adExpiryTime,
        receipt_image: data.receipt_image,
        reviewStatus: data.reviewStatus || "pending",
        reviewed_by: data.reviewed_by,
        review_note: data.review_note,
        adPackage: data.adPackage,
        adPackageName: data.adPackageName,
        adPackagePrice: data.adPackagePrice,
        adPackageDuration: data.adPackageDuration,
      };
    });
  }

  // 🔁 استماع لحظي للإعلانات المفعلة (ads=true AND reviewStatus='approved')
  static subscribeActiveAds(callback) {
    // // التحقق من حالة تسجيل الدخول
    // const currentUser = auth.currentUser;
    // if (!currentUser) {
    //   throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات المفعلة");
    // }

    const q = query(
      collection(db, "RealEstateDeveloperAdvertisements"),
      where("ads", "==", true),
      where("reviewStatus", "==", "approved")
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          developer_name: data.developer_name,
          description: data.description,
          project_types: data.project_types,
          images: data.images || [],
          phone: data.phone,
          location: data.location,
          price_start_from: data.price_start_from,
          price_end_to: data.price_end_to,
          userId: data.userId,
          type_of_user: data.type_of_user,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          floor: data.floor,
          furnished: data.furnished,
          status: data.status,
          paymentMethod: data.paymentMethod,
          negotiable: data.negotiable,
          deliveryTerms: data.deliveryTerms,
          features: data.features || [],
          area: data.area,
          ads: data.ads !== undefined ? data.ads : false,
          adExpiryTime: data.adExpiryTime,
          receipt_image: data.receipt_image,
          reviewStatus: data.reviewStatus || "pending",
          reviewed_by: data.reviewed_by,
          review_note: data.review_note,
          adPackage: data.adPackage,
          adPackageName: data.adPackageName,
          adPackagePrice: data.adPackagePrice,
          adPackageDuration: data.adPackageDuration,
        };
      });
      callback(ads);
    });
  }

  // 🔁 استماع لحظي لجميع الإعلانات
  static subscribeAllAds(callback) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات");
    }
    const q = collection(db, "RealEstateDeveloperAdvertisements");
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          developer_name: data.developer_name,
          description: data.description,
          project_types: data.project_types,
          images: data.images || [],
          phone: data.phone,
          location: data.location,
          price_start_from: data.price_start_from,
          price_end_to: data.price_end_to,
          userId: data.userId,
          type_of_user: data.type_of_user,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          floor: data.floor,
          furnished: data.furnished,
          status: data.status,
          paymentMethod: data.paymentMethod,
          negotiable: data.negotiable,
          deliveryTerms: data.deliveryTerms,
          features: data.features || [],
          area: data.area,
          ads: data.ads !== undefined ? data.ads : false,
          adExpiryTime: data.adExpiryTime,
          receipt_image: data.receipt_image,
          reviewStatus: data.reviewStatus || "pending",
          reviewed_by: data.reviewed_by,
          review_note: data.review_note,
          adPackage: data.adPackage,
          adPackageName: data.adPackageName,
          adPackagePrice: data.adPackagePrice,
          adPackageDuration: data.adPackageDuration,
        };
      });
      callback(ads);
    });
  }

  // 🔁 استماع لحظي لإعلانات مستخدم معين
  static subscribeByUserId(userId, callback) {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل الاشتراك في العقارات");
    }
    const q = query(
      collection(db, "RealEstateDeveloperAdvertisements"),
      where("userId", "==", userId)
    );
    return onSnapshot(q, (snap) => {
      const ads = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          developer_name: data.developer_name,
          description: data.description,
          project_types: data.project_types,
          images: data.images || [],
          phone: data.phone,
          location: data.location,
          price_start_from: data.price_start_from,
          price_end_to: data.price_end_to,
          userId: data.userId,
          type_of_user: data.type_of_user,
          rooms: data.rooms,
          bathrooms: data.bathrooms,
          floor: data.floor,
          furnished: data.furnished,
          status: data.status,
          paymentMethod: data.paymentMethod,
          negotiable: data.negotiable,
          deliveryTerms: data.deliveryTerms,
          features: data.features || [],
          area: data.area,
          ads: data.ads !== undefined ? data.ads : false,
          adExpiryTime: data.adExpiryTime,
          receipt_image: data.receipt_image,
          reviewStatus: data.reviewStatus || "pending",
          reviewed_by: data.reviewed_by,
          review_note: data.review_note,
          adPackage: data.adPackage,
          adPackageName: data.adPackageName,
          adPackagePrice: data.adPackagePrice,
          adPackageDuration: data.adPackageDuration,
        };
      });
      callback(ads);
    });
  }

  // 🔐 رفع صور الإعلان
  async #uploadImages(files = []) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً قبل رفع الصور");
    if (!this.#id) throw new Error("Ad ID is required for uploading images");
    const storage = getStorage();
    const urls = [];
    const limited = files.slice(0, 4);
    for (let i = 0; i < limited.length; i++) {
      const refPath = ref(
        storage,
        `property_images/${this.userId}/${this.#id}/image_${i + 1}.jpg`
      );
      await uploadBytes(refPath, limited[i]);
      urls.push(await getDownloadURL(refPath));
    }
    return urls;
  }

  // 🔐 رفع إيصال الدفع
  async #uploadReceipt(file) {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("يجب تسجيل الدخول أولاً قبل رفع الإيصال");
    if (!this.#id) throw new Error("Ad ID is required for uploading receipt");
    const storage = getStorage();
    const refPath = ref(
      storage,
      `property_images/${this.userId}/${this.#id}/receipt.jpg`
    );
    await uploadBytes(refPath, file);
    return await getDownloadURL(refPath);
  }

  async #deleteAllImages() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل حذف الصور");
    }

    if (!this.#id) {
      console.warn("No ad ID available for image deletion");
      return;
    }

    // Delete only images belonging to this specific ad
    const dirRef = ref(
      getStorage(),
      `property_images/${this.userId}/${this.#id}`
    );
    try {
      const list = await listAll(dirRef);
      for (const fileRef of list.items) await deleteObject(fileRef);
      console.log(`Successfully deleted all images for ad ${this.#id}`);
    } catch (error) {
      console.warn(
        `Failed to delete images for ad ${this.#id}:`,
        error.message
      );
    }
  }

  // 🗑️ حذف إيصال الدفع
  async #deleteReceipt() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل حذف الإيصال");
    }

    if (!this.#id) {
      console.warn("No ad ID available for receipt deletion");
      return;
    }

    // Delete receipt using the new ad-specific path structure
    const fileRef = ref(
      getStorage(),
      `property_images/${this.userId}/${this.#id}/receipt.jpg`
    );
    try {
      await deleteObject(fileRef);
      console.log(`Successfully deleted receipt for ad ${this.#id}`);
    } catch (error) {
      console.warn(
        `Failed to delete receipt for ad ${this.#id}:`,
        error.message
      );
    }
  }

  // 📤 تجهيز بيانات الإعلان للتخزين
  #getAdData() {
    // التحقق من حالة تسجيل الدخول
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("يجب تسجيل الدخول أولاً قبل تجهيز بيانات العقار");
    }

    // استخراج معلومات الباقة إذا كانت موجودة
    let adPackageName = null,
      adPackagePrice = null,
      adPackageDuration = null;
    const pkgKey = String(this.adPackage);
    if (pkgKey && PACKAGE_INFO[pkgKey]) {
      adPackageName = PACKAGE_INFO[pkgKey].name;
      adPackagePrice = PACKAGE_INFO[pkgKey].price;
      adPackageDuration = PACKAGE_INFO[pkgKey].duration;
    }

    const data = {
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
      receipt_image: this.receipt_image,
      reviewStatus: this.reviewStatus,
      reviewed_by: this.reviewed_by,
      review_note: this.review_note,
      adPackage: this.adPackage,
      adPackageName,
      adPackagePrice,
      adPackageDuration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    // إضافة الـ ID إذا كان موجوداً
    if (this.#id) {
      data.id = this.#id;
    }

    return data;
  }
}

export default RealEstateDeveloperAdvertisement;
