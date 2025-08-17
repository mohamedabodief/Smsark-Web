import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

import { db, auth } from '../firebaseConfig';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

class User {
  static allowedUserTypes = ['admin', 'client', 'organization'];

  constructor(data) {
    const uid = data.uid || auth.currentUser?.uid;

    if (!uid) {
      throw new Error(
        '❌ لا يمكن إنشاء كائن المستخدم: لم يتم تمرير UID، ولا يوجد مستخدم مسجل دخول في Firebase Auth.'
      );
    }

    if (
      data.type_of_user &&
      !User.allowedUserTypes.includes(data.type_of_user)
    ) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
          ', '
        )}`
      );
    }

    this.uid = uid;
    this.type_of_user = data.type_of_user || null;

    this.phone = data.phone || null;
    this.image = data.image || null;
    this.city = data.city || null;
    this.governorate = data.governorate || null;
    this.address = data.address || null;

    // Client
    this.cli_name = data.cli_name || null;
    this.gender = data.gender || null;
    this.age = data.age || null;

    // Organization
    this.org_name = data.org_name || null;
    this.type_of_organization = data.type_of_organization || null;

    // Admin
    this.adm_name = data.adm_name || null;

    // Timestamps for analytics
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromClientData(clientData) {
    return new User(clientData);
  }

  static fromOrganizationData(orgData) {
    return new User(orgData);
  }

  static fromAdminData(adminData) {
    return new User(adminData);
  }

  /**
   * حفظ المستخدم + رفع صورة إن وُجدت
   */
  async saveToFirestore(imageFile = null) {
    // Set creation timestamp
    this.createdAt = Date.now();
    this.updatedAt = Date.now();

    const docRef = doc(db, 'users', this.uid);

    if (imageFile) {
      const imageUrl = await this.#uploadImage(imageFile);
      this.image = imageUrl;
    }

    await setDoc(docRef, { ...this });
  }

  /**
   * تحديث بيانات المستخدم + تحديث الصورة إن وُجدت
   */
  async updateInFirestore(updates, newImageFile = null) {
    if (
      updates.type_of_user &&
      !User.allowedUserTypes.includes(updates.type_of_user)
    ) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
          ', '
        )}`
      );
    }

    const docRef = doc(db, 'users', this.uid);

    if (newImageFile) {
      if (this.image) {
        await this.#deleteImage(this.image);
      }
      const newImageUrl = await this.#uploadImage(newImageFile);
      updates.image = newImageUrl;
      this.image = newImageUrl;
    }

    // Set updated timestamp
    updates.updatedAt = Date.now();
    this.updatedAt = updates.updatedAt;

    await updateDoc(docRef, updates);
  }

  /**
   * حذف المستخدم + حذف صورته
   */
  async deleteFromFirestore() {
    const docRef = doc(db, 'users', this.uid);

    if (this.image) {
      await this.#deleteImage(this.image);
    }

    await deleteDoc(docRef);
  }

  /**
   * جلب بيانات مستخدم عبر UID
   */
  static async getByUid(uid) {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new User({ uid, ...snapshot.data() });
    }
    return null;
  }

  /**
   * جلب كل المستخدمين من Firestore
   */
  static async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(
      (doc) => new User({ uid: doc.id, ...doc.data() })
    );
  }

  /**
   * جلب كل المستخدمين من نوع معيّن
   */
  static async getAllUsersByType(type) {
    if (!User.allowedUserTypes.includes(type)) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
          ', '
        )}`
      );
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('type_of_user', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => new User({ uid: doc.id, ...doc.data() })
    );
  }

  /**
   * حفظ FCM Token داخل مستند المستخدم
   */
  async saveFcmToken(token) {
    if (!token) {
      throw new Error('⚠️ لا يمكن حفظ FCM Token فارغ!');
    }

    const docRef = doc(db, 'users', this.uid);
    await updateDoc(docRef, { fcm_token: token });

    console.log('✅ تم حفظ FCM Token في مستند المستخدم بنجاح');
  }

  /**
   * 📤 رفع الصورة إلى Storage وإرجاع الرابط
   */
  async #uploadImage(file) {
    const storage = getStorage();
    const storageRef = ref(storage, `users/${this.uid}/profile.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  /**
   * 🗑 حذف الصورة من Storage
   */
  async #deleteImage(imageUrl) {
    try {
      const storage = getStorage();
      const path = decodeURIComponent(
        new URL(imageUrl).pathname.split('/o/')[1].split('?')[0]
      );
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);
    } catch (error) {
      console.warn('⚠️ لم يتم حذف الصورة من Storage:', error.message);
    }
  }

  /**
   * 📡 الاشتراك اللحظي في بيانات مستخدم معيّن
   * @param {string} uid - معرف المستخدم
   * @param {function} callback - دالة تُستدعى كلما تغيرت البيانات
   * @returns {function} unsubscribe - دالة لإلغاء الاشتراك
   */
  static subscribeToUser(uid, callback) {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const user = new User({ uid, ...snapshot.data() });
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  // example usage:

  // const unsubscribe = User.subscribeToUser('some-uid', (user) => {
  //   if (user) {
  //     console.log('📦 بيانات المستخدم المحدثة:', user);
  //     // ممكن تحدث الحالة في React أو Vue مثلاً
  //   } else {
  //     console.log('❌ تم حذف المستخدم أو لم يعد موجودًا');
  //   }
  // });

  // // لإلغاء الاشتراك لاحقًا
  // // unsubscribe();

  
}

export default User;

// import {
//   doc,
//   setDoc,
//   getDoc,
//   deleteDoc,
//   updateDoc,
//   getDocs,
//   collection,
//   query,
//   where,
//   onSnapshot,
// } from 'firebase/firestore';

// import { db, auth } from '../firebaseConfig';
// import {
//   getStorage,
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from 'firebase/storage';

// class User {
//   static allowedUserTypes = ['admin', 'client', 'organization'];

//   constructor(data) {
//     const uid = data.uid || auth.currentUser?.uid;

//     if (!uid) {
//       throw new Error(
//         '❌ لا يمكن إنشاء كائن المستخدم: لم يتم تمرير UID، ولا يوجد مستخدم مسجل دخول في Firebase Auth.'
//       );
//     }

//     if (
//       data.type_of_user &&
//       !User.allowedUserTypes.includes(data.type_of_user)
//     ) {
//       throw new Error(
//         `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
//           ', '
//         )}`
//       );
//     }

//     this.uid = uid;
//     this.type_of_user = data.type_of_user || null;

//     this.phone = data.phone || null;
//     this.image = data.image || null;
//     this.city = data.city || null;
//     this.governorate = data.governorate || null;
//     this.address = data.address || null;

//     // Client
//     this.cli_name = data.cli_name || null;
//     this.gender = data.gender || null;
//     this.age = data.age || null;

//     // Organization
//     this.org_name = data.org_name || null;
//     this.type_of_organization = data.type_of_organization || null;

//     // Admin
//     this.adm_name = data.adm_name || null;
//   }

//   static fromClientData(clientData) {
//     return new User(clientData);
//   }

//   static fromOrganizationData(orgData) {
//     return new User(orgData);
//   }

//   static fromAdminData(adminData) {
//     return new User(adminData);
//   }

//   /**
//    * حفظ المستخدم + رفع صورة إن وُجدت
//    */
//   async saveToFirestore(imageFile = null) {
//     const docRef = doc(db, 'users', this.uid);

//     if (imageFile) {
//       const imageUrl = await this.#uploadImage(imageFile);
//       this.image = imageUrl;
//     }

//     await setDoc(docRef, { ...this });
//   }

//   /**
//    * تحديث بيانات المستخدم + تحديث الصورة إن وُجدت
//    */
//   async updateInFirestore(updates, newImageFile = null) {
//     if (
//       updates.type_of_user &&
//       !User.allowedUserTypes.includes(updates.type_of_user)
//     ) {
//       throw new Error(
//         `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
//           ', '
//         )}`
//       );
//     }

//     const docRef = doc(db, 'users', this.uid);

//     if (newImageFile) {
//       if (this.image) {
//         await this.#deleteImage(this.image);
//       }
//       const newImageUrl = await this.#uploadImage(newImageFile);
//       updates.image = newImageUrl;
//       this.image = newImageUrl;
//     }

//     await updateDoc(docRef, updates);
//   }

//   /**
//    * حذف المستخدم + حذف صورته
//    */
//   async deleteFromFirestore() {
//     const docRef = doc(db, 'users', this.uid);

//     if (this.image) {
//       await this.#deleteImage(this.image);
//     }

//     await deleteDoc(docRef);
//   }

//   /**
//    * جلب بيانات مستخدم عبر UID
//    */
//   static async getByUid(uid) {
//     const docRef = doc(db, 'users', uid);
//     const snapshot = await getDoc(docRef);
//     if (snapshot.exists()) {
//       return new User({ uid, ...snapshot.data() });
//     }
//     return null;
//   }

//   /**
//    * جلب كل المستخدمين من Firestore
//    */
//   static async getAllUsers() {
//     const querySnapshot = await getDocs(collection(db, 'users'));
//     return querySnapshot.docs.map(
//       (doc) => new User({ uid: doc.id, ...doc.data() })
//     );
//   }

//   /**
//    * جلب كل المستخدمين من نوع معيّن
//    */
//   static async getAllUsersByType(type) {
//     if (!User.allowedUserTypes.includes(type)) {
//       throw new Error(
//         `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
//           ', '
//         )}`
//       );
//     }

//     const usersRef = collection(db, 'users');
//     const q = query(usersRef, where('type_of_user', '==', type));
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map(
//       (doc) => new User({ uid: doc.id, ...doc.data() })
//     );
//   }

//   /**
//    * حفظ FCM Token داخل مستند المستخدم
//    */
//   async saveFcmToken(token) {
//     if (!token) {
//       throw new Error('⚠️ لا يمكن حفظ FCM Token فارغ!');
//     }

//     const docRef = doc(db, 'users', this.uid);
//     await updateDoc(docRef, { fcm_token: token });

//     console.log('✅ تم حفظ FCM Token في مستند المستخدم بنجاح');
//   }

//   /**
//    * 📤 رفع الصورة إلى Storage وإرجاع الرابط
//    */
//   async #uploadImage(file) {
//     const storage = getStorage();
//     const storageRef = ref(storage, `users/${this.uid}/profile.jpg`);
//     await uploadBytes(storageRef, file);
//     const downloadURL = await getDownloadURL(storageRef);
//     return downloadURL;
//   }

//   /**
//    * 🗑 حذف الصورة من Storage
//    */
//   async #deleteImage(imageUrl) {
//     try {
//       const storage = getStorage();
//       const path = decodeURIComponent(
//         new URL(imageUrl).pathname.split('/o/')[1].split('?')[0]
//       );
//       const imageRef = ref(storage, path);
//       await deleteObject(imageRef);
//     } catch (error) {
//       console.warn('⚠️ لم يتم حذف الصورة من Storage:', error.message);
//     }
//   }

//   /**
//    * 📡 الاشتراك اللحظي في بيانات مستخدم معيّن
//    * @param {string} uid - معرف المستخدم
//    * @param {function} callback - دالة تُستدعى كلما تغيرت البيانات
//    * @returns {function} unsubscribe - دالة لإلغاء الاشتراك
//    */
//   static subscribeToUser(uid, callback) {
//     const userRef = doc(db, 'users', uid);
//     return onSnapshot(userRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const user = new User({ uid, ...snapshot.data() });
//         callback(user);
//       } else {
//         callback(null);
//       }
//     });
//   }

//   // example usage:

//   // const unsubscribe = User.subscribeToUser('some-uid', (user) => {
//   //   if (user) {
//   //     console.log('📦 بيانات المستخدم المحدثة:', user);
//   //     // ممكن تحدث الحالة في React أو Vue مثلاً
//   //   } else {
//   //     console.log('❌ تم حذف المستخدم أو لم يعد موجودًا');
//   //   }
//   // });

//   // // لإلغاء الاشتراك لاحقًا
//   // // unsubscribe();

  
// }

// export default User;
