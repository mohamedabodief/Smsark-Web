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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

class FinancingRequest {
  #id = null;

  constructor(data) {
    this.#id = data.id || null;
    this.user_id = data.user_id;
    this.advertisement_id = data.advertisement_id || null;
    this.monthly_income = data.monthly_income;
    this.job_title = data.job_title;
    this.employer = data.employer;
    this.age = data.age;
    this.marital_status = data.marital_status;
    this.dependents = data.dependents;
    this.financing_amount = data.financing_amount;
    this.repayment_years = data.repayment_years;
    this.status = data.status || 'pending'; // 'pending' | 'reviewed' | 'approved' | 'rejected'
    this.submitted_at = data.submitted_at || Timestamp.now();
  }

  get id() {
    return this.#id;
  }

  /**
   * حفظ الطلب في قاعدة البيانات
   */
  async save() {
    const colRef = collection(db, 'FinancingRequests');
    const docRef = await addDoc(colRef, {
      user_id: this.user_id,
      advertisement_id: this.advertisement_id,
      monthly_income: this.monthly_income,
      job_title: this.job_title,
      employer: this.employer,
      age: this.age,
      marital_status: this.marital_status,
      dependents: this.dependents,
      financing_amount: this.financing_amount,
      repayment_years: this.repayment_years,
      status: this.status,
      submitted_at: this.submitted_at,
    });
    this.#id = docRef.id;
    await updateDoc(docRef, { id: this.#id });
    return this.#id;
  }

  /**
   * تحديث بيانات الطلب
   */
  async update(updates) {
    if (!this.#id) throw new Error('الطلب بدون ID غير قابل للتحديث');
    const docRef = doc(db, 'FinancingRequests', this.#id);
    await updateDoc(docRef, updates);
  }

  /**
   * حذف الطلب
   */
  async delete() {
    if (!this.#id) throw new Error('الطلب بدون ID غير قابل للحذف');
    const docRef = doc(db, 'FinancingRequests', this.#id);
    await deleteDoc(docRef);
  }

  /**
   * استرجاع طلب معين بالمعرّف
   */
  static async getById(id) {
    const docRef = doc(db, 'FinancingRequests', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return new FinancingRequest({ id, ...snapshot.data() });
    }
    return null;
  }

  /**
   * استماع لحظي لجميع طلبات التمويل الخاصة بمستخدم
   */
  static subscribeByUser(userId, callback) {
    const colRef = collection(db, 'FinancingRequests');
    const q = query(colRef, where('user_id', '==', userId));
    return onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map(
        (docSnap) => new FinancingRequest({ id: docSnap.id, ...docSnap.data() })
      );
      callback(requests);
    });
  }

  /**
   * حساب القسط الشهري الثابت تلقائيًا بناءً على مدة السداد
   * معدل الفائدة يُحدد تلقائيًا حسب عدد السنوات:
   * - حتى 5 سنوات = 10%
   * - حتى 10 سنوات = 12%
   * - أكثر من 10 سنوات = 14%
   * @returns {string} قيمة القسط الشهري بالتقريب
   */
  calculateMonthlyInstallment() {
    const principal = this.financing_amount;
    const years = this.repayment_years;

    if (!principal || !years) return '0.00';

    let annualRate;
    if (years <= 5) annualRate = 10;
    else if (years <= 10) annualRate = 12;
    else annualRate = 14;

    const r = annualRate / 12 / 100;
    const n = years * 12;

    const monthlyInstallment =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return monthlyInstallment.toFixed(2);
  }
}

export default FinancingRequest;
