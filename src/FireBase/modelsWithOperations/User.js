import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { auth } from '../firebaseConfig';

class User {
  static allowedUserTypes = ['admin', 'client', 'organization'];

  constructor(data) {
    // ✅ جلب UID من البيانات أو من Firebase Auth
    const uid = data.uid || auth.currentUser?.uid;

    // ✅ تحقق: لا يمكن إنشاء مستخدم بدون UID
    if (!uid) {
      throw new Error(
        'لا يمكن إنشاء كائن المستخدم: لم يتم تمرير UID، ولا يوجد مستخدم مسجل دخول في Firebase Auth.'
      );
    }

    // ✅ تحقق من نوع المستخدم
    if (!User.allowedUserTypes.includes(data.type_of_user)) {
      throw new Error(
        `نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
          ', '
        )}`
      );
    }

    this.uid = uid;
    this.type_of_user = data.type_of_user;
    this.phone = data.phone;
    this.image = data.image || null;
    this.city = data.city || null;
    this.governorate = data.governorate || null;
    this.address = data.address || null;

    // الحقول الخاصة بأنواع المستخدم المختلفة
    this.cli_name = data.cli_name || null;
    this.gender = data.gender || null;
    this.age = data.age || null;

    this.org_name = data.org_name || null;
    this.type_of_organization = data.type_of_organization || null;

    this.adm_name = data.adm_name || null;
    this.user_name = data.user_name || null;
  }

  // ميثودات مصنع لإنشاء User من كل نوع من الداتا
  static fromClientData(clientData) {
    return new User(clientData);
  }

  static fromOrganizationData(organizationData) {
    return new User(organizationData);
  }

  static fromAdminData(adminData) {
    return new User(adminData);
  }

  // حفظ المستخدم
  async saveToFirestore() {
    const docRef = doc(db, 'users', this.uid);
    await setDoc(docRef, { ...this }); // نسخ محتويات this
  }

  // تعديل المستخدم
  async updateInFirestore(updates) {
    if (
      updates.type_of_user &&
      !User.allowedUserTypes.includes(updates.type_of_user)
    ) {
      throw new Error(
        `نوع المستخدم غير صالح! الأنواع المسموحة هي: ${User.allowedUserTypes.join(
          ', '
        )}`
      );
    }
    const docRef = doc(db, 'users', this.uid);
    await updateDoc(docRef, updates);
  }

  // حذف المستخدم
  async deleteFromFirestore() {
    const docRef = doc(db, 'users', this.uid);
    await deleteDoc(docRef);
  }

  // استرجاع المستخدم بالـ uid
  static async getByUid(uid) {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new User(snapshot.data());
    }
    return null;
  }

  // استرجاع جميع المستخدمين
  static async getAllUsers() {
    const { getDocs, collection } = await import('firebase/firestore');
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc) => new User(doc.data()));
  }
}

export default User;
