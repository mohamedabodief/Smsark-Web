import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig';

class User {
  static allowedUserTypes = ['admin', 'client', 'organization'];

  constructor(data) {
    const uid = data.uid || auth.currentUser?.uid;
    if (!uid) {
      throw new Error(
        'لا يمكن إنشاء كائن المستخدم: لم يتم تمرير UID، ولا يوجد مستخدم مسجل دخول في Firebase Auth.'
      );
    }

    if (!User.allowedUserTypes.includes(data.type_of_user)) {
      throw new Error(
        `نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }

    this.uid = uid;
    this.type_of_user = data.type_of_user;
    this.phone = data.phone;
    this.image = data.image || null;
    this.city = data.city || null;
    this.governorate = data.governorate || null;
    this.address = data.address || null;

    this.cli_name = data.cli_name || null;
    this.gender = data.gender || null;
    this.age = data.age || null;

    this.org_name = data.org_name || null;
    this.type_of_organization = data.type_of_organization || null;

    this.adm_name = data.adm_name || null;
    this.user_name = data.user_name || null;
  }

  static fromClientData(clientData) {
    return new User(clientData);
  }

  static fromOrganizationData(organizationData) {
    return new User(organizationData);
  }

  static fromAdminData(adminData) {
    return new User(adminData);
  }

  async saveToFirestore() {
    const docRef = doc(db, 'users', this.uid);
    await setDoc(docRef, { ...this });
  }

  async updateInFirestore(updates) {
    if (
      updates.type_of_user &&
      !User.allowedUserTypes.includes(updates.type_of_user)
    ) {
      throw new Error(
        `نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }
    const docRef = doc(db, 'users', this.uid);
    await updateDoc(docRef, updates);
  }

  async deleteFromFirestore() {
    const docRef = doc(db, 'users', this.uid);
    await deleteDoc(docRef);
  }

  static async getByUid(uid) {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new User(snapshot.data());
    }
    return null;
  }

  static async getAllUsers() {
    const { getDocs, collection } = await import('firebase/firestore');
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc) => new User(doc.data()));
  }

  static async getAllUsersByType(type) {
    const { getDocs, collection, query, where } = await import('firebase/firestore');
    if (!User.allowedUserTypes.includes(type)) {
      throw new Error(
        `نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(', ')}`
      );
    }
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('type_of_user', '==', type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => new User(doc.data()));
  }

  /**
   * ✅ حفظ FCM Token داخل مستند المستخدم في Firestore
   * @param {string} token - التوكن المُولد من FCM
   */
  async saveFcmToken(token) {
    if (!token) {
      throw new Error('⚠️ لا يمكن حفظ FCM Token فارغ!');
    }

    const docRef = doc(db, 'users', this.uid);
    await updateDoc(docRef, {
      fcm_token: token,
    });

    console.log('✅ تم حفظ FCM Token في مستند المستخدم بنجاح');
  }
}

export default User;
