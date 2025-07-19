// src/Users/User.js
// src/Users/User.js

import { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; // Ensure this path is correct

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
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    this.uid = uid;
    this.type_of_user = data.type_of_user || null;

    this.phone = data.phone || null;
    this.image = data.image || null;
    this.city = data.city || null;
    this.governorate = data.governorate || null;
    this.address = data.address || null;

    // Client specific
    this.cli_name = data.cli_name || null;
    this.gender = data.gender || null;
    this.age = data.age || null;

    // Organization specific
    this.org_name = data.org_name || null;
    this.type_of_organization = data.type_of_organization || null;

    // Admin specific
    this.adm_name = data.adm_name || null;
    this.user_name = data.user_name || null;
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

  async saveToFirestore() {
    const docRef = doc(db, 'users', this.uid);
    console.log("User.saveToFirestore: Attempting to save document for UID:", this.uid, "Data:", { ...this });
    await setDoc(docRef, { ...this });
    console.log("User.saveToFirestore: Document saved successfully for UID:", this.uid);
  }

  async updateInFirestore(updates) {
    if (
      updates.type_of_user &&
      !User.allowedUserTypes.includes(updates.type_of_user)
    ) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    const docRef = doc(db, 'users', this.uid);
    console.log("User.updateInFirestore: Attempting to update document for UID:", this.uid, "Updates:", updates);
    await updateDoc(docRef, updates);
    console.log("User.updateInFirestore: Document updated successfully for UID:", this.uid);
  }

  async deleteFromFirestore() {
    const docRef = doc(db, 'users', this.uid);
    console.log("User.deleteFromFirestore: Attempting to delete document for UID:", this.uid);
    await deleteDoc(docRef);
    console.log("User.deleteFromFirestore: Document deleted successfully for UID:", this.uid);
  }

  static async getByUid(uid) {
    console.log("User.getByUid: Attempting to get document for UID:", uid);
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    console.log("User.getByUid: Snapshot exists:", snapshot.exists());
    if (snapshot.exists()) {
      const data = snapshot.data();
      console.log("User.getByUid: Document data:", data);
      // return { uid, ...data }; // Return a plain object 
      return new User({ uid, ...data }); // Return a User instance
    }
    return null;
  }

  static async getAllUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    // Return plain objects here too
    return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  }

  static async getAllUsersByType(type) {
    if (!User.allowedUserTypes.includes(type)) {
      throw new Error(
        `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('type_of_user', '==', type));
    const querySnapshot = await getDocs(q);
    // CRITICAL FIX: Return plain objects instead of User instances
    return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  }

  async saveFcmToken(token) {
    if (!token) {
      throw new Error('⚠️ لا يمكن حفظ FCM Token فارغ!');
    }

    const docRef = doc(db, 'users', this.uid);
    await updateDoc(docRef, { fcm_token: token });

    console.log('✅ تم حفظ FCM Token في مستند المستخدم بنجاح');
  }
}

export default User;

//===========================================================
// import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
// import { db, auth } from '../firebaseConfig'; // Ensure this path is correct

// class User {
//   // Added 'admin' to allowedUserTypes
//   static allowedUserTypes = ['admin', 'client', 'organization'];

//   constructor(data) {
//     const uid = data.uid || auth.currentUser?.uid;

//     if (!uid) {
//       throw new Error(
//         '❌  لا يمكن إنشاء كائن المستخدم: لم يتم تمرير UID، ولا يوجد مستخدم مسجل دخول في Firebase Auth.'
//       );
//     }

//     if (
//       data.type_of_user &&
//       !User.allowedUserTypes.includes(data.type_of_user)
//     ) {
//       throw new Error(
//         `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
//       );
//     }

//     this.uid = uid;
//     this.type_of_user = data.type_of_user || null;

//     this.phone = data.phone || null;
//     this.image = data.image || null;
//     this.city = data.city || null;
//     this.governorate = data.governorate || null;
//     this.address = data.address || null;

//     // Client specific
//     this.cli_name = data.cli_name || null;
//     this.gender = data.gender || null;
//     this.age = data.age || null;

//     // Organization specific
//     this.org_name = data.org_name || null;
//     this.type_of_organization = data.type_of_organization || null;

//     // Admin specific - Added adm_name
//     this.adm_name = data.adm_name || null;
//     this.user_name = data.user_name || null; // Assuming user_name is also part of admin data if needed
//   }

//   static fromClientData(clientData) {
//     return new User(clientData);
//   }

//   static fromOrganizationData(orgData) {
//     return new User(orgData);
//   }

//   // New static method for Admin data
//   static fromAdminData(adminData) {
//     return new User(adminData);
//   }

//   async saveToFirestore() {
//     const docRef = doc(db, 'users', this.uid);
//     console.log("User.saveToFirestore: Attempting to save document for UID:", this.uid, "Data:", { ...this });
//     await setDoc(docRef, { ...this });
//     console.log("User.saveToFirestore: Document saved successfully for UID:", this.uid);
//   }

//   async updateInFirestore(updates) {
//     if (
//       updates.type_of_user &&
//       !User.allowedUserTypes.includes(updates.type_of_user)
//     ) {
//       throw new Error(
//         `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
//       );
//     }

//     const docRef = doc(db, 'users', this.uid);
//     console.log("User.updateInFirestore: Attempting to update document for UID:", this.uid, "Updates:", updates);
//     await updateDoc(docRef, updates);
//     console.log("User.updateInFirestore: Document updated successfully for UID:", this.uid);
//   }

//   async deleteFromFirestore() {
//     const docRef = doc(db, 'users', this.uid);
//     console.log("User.deleteFromFirestore: Attempting to delete document for UID:", this.uid);
//     await deleteDoc(docRef);
//     console.log("User.deleteFromFirestore: Document deleted successfully for UID:", this.uid);
//   }

//   static async getByUid(uid) {
//     console.log("User.getByUid: Attempting to get document for UID:", uid);
//     const docRef = doc(db, 'users', uid);
//     const snapshot = await getDoc(docRef);
//     console.log("User.getByUid: Snapshot exists:", snapshot.exists());
//     if (snapshot.exists()) {
//       const data = snapshot.data();
//       console.log("User.getByUid: Document data:", data);
//       // Return a plain object, not a new User instance
//       return { uid, ...data };
//     }
//     return null;
//   }

//   static async getAllUsers() {
//     const { getDocs, collection } = await import('firebase/firestore');
//     const querySnapshot = await getDocs(collection(db, 'users'));
//     return querySnapshot.docs.map((doc) => new User({ uid: doc.id, ...doc.data() }));
//   }

//   static async getAllUsersByType(type) {
//     const { getDocs, collection, query, where } = await import('firebase/firestore');
//     if (!User.allowedUserTypes.includes(type)) {
//       throw new Error(
//         `❌ نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
//       );
//     }

//     const usersRef = collection(db, 'users');
//     const q = query(usersRef, where('type_of_user', '==', type));
//     const querySnapshot = await getDocs(q);
//     return querySnapshot.docs.map((doc) => new User({ uid: doc.id, ...doc.data() }));
//   }

//   async saveFcmToken(token) {
//     if (!token) {
//       throw new Error('⚠️ لا يمكن حفظ FCM Token فارغ!');
//     }

//     const docRef = doc(db, 'users', this.uid);
//     await updateDoc(docRef, { fcm_token: token });

//     console.log('✅ تم حفظ FCM Token في مستند المستخدم بنجاح');
//   }
// }

// export default User;
