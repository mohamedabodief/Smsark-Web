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

  /**
   * مُنشئ الكلاس - يستقبل بيانات الطلب
   */
  constructor(data) {
    this.#id = data.id || null;
    this.user_id = data.user_id; // رقم المستخدم صاحب الطلب
    this.advertisement_id = data.advertisement_id || null; // رقم الإعلان التمويلي المرتبط
    this.monthly_income = data.monthly_income; // الدخل الشهري
    this.job_title = data.job_title; // الوظيفة
    this.employer = data.employer; // جهة العمل
    this.age = data.age; // السن
    this.marital_status = data.marital_status; // الحالة الاجتماعية
    this.dependents = data.dependents; // عدد المعالين
    this.financing_amount = data.financing_amount; // المبلغ المطلوب
    this.repayment_years = data.repayment_years; // عدد سنوات السداد
    this.status = data.status || 'pending'; // حالة الطلب
    this.submitted_at = data.submitted_at || Timestamp.now(); // وقت الإرسال
  }

  get id() {
    return this.#id;
  }

  /**
   * حفظ الطلب في قاعدة البيانات
   * يتحقق أولًا من وجود الإعلان التمويلي المرتبط
   */
  async save() {
    if (!this.advertisement_id) {
      throw new Error('لم يتم تمرير معرّف إعلان التمويل.');
    }

    const adRef = doc(db, 'FinancingAdvertisements', this.advertisement_id);
    const adSnap = await getDoc(adRef);
    if (!adSnap.exists()) {
      throw new Error('إعلان التمويل غير موجود أو تم حذفه.');
    }

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
   * حذف الطلب من قاعدة البيانات
   */
  async delete() {
    if (!this.#id) throw new Error('الطلب بدون ID غير قابل للحذف');
    const docRef = doc(db, 'FinancingRequests', this.#id);
    await deleteDoc(docRef);
  }

  /**
   * جلب طلب واحد حسب ID
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
   * الاشتراك اللحظي في طلبات التمويل لمستخدم معيّن
   * callback يتم تنفيذه عند أي تغيير
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
   * حساب القسط الشهري بناءً على:
   * - مبلغ التمويل
   * - مدة السداد
   * - نسب الفائدة وحدود المبلغ مأخوذة من إعلان التمويل المرتبط
   */
  async calculateMonthlyInstallment() {
    const principal = this.financing_amount; // قيمة القرض
    const years = this.repayment_years; // عدد سنوات السداد

    if (!principal || !years) return '0.00';

    // جلب الإعلان المرتبط للحصول على بيانات الفائدة والحدود
    const ad = await this.getAdvertisement();
    if (!ad) throw new Error('❌ إعلان التمويل غير موجود.');

    const MIN_AMOUNT = ad.start_limit;
    const MAX_AMOUNT = ad.end_limit;

    // التحقق من أن مبلغ التمويل يقع داخل الحدود
    if (principal < MIN_AMOUNT || principal > MAX_AMOUNT) {
      throw new Error(
        `❌ مبلغ التمويل يجب أن يكون بين ${MIN_AMOUNT.toLocaleString()} و ${MAX_AMOUNT.toLocaleString()}.`
      );
    }

    // تحديد الفائدة حسب مدة السداد
    let annualRate;
    if (years <= 5) annualRate = ad.interest_rate_upto_5;
    else if (years <= 10) annualRate = ad.interest_rate_upto_10;
    else annualRate = ad.interest_rate_above_10;

    // تحويل الفائدة الشهرية
    const r = annualRate / 12 / 100;
    const n = years * 12;

    // حساب القسط الشهري باستخدام معادلة القرض المركب
    const monthlyInstallment =
      (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

    return monthlyInstallment.toFixed(2); // النتيجة كنص
  }

  /**
   * جلب كائن إعلان التمويل المرتبط بالطلب
   */
  async getAdvertisement() {
    if (!this.advertisement_id) return null;
    const { getDoc, doc } = await import('firebase/firestore');
    const adRef = doc(db, 'FinancingAdvertisements', this.advertisement_id);
    const adSnap = await getDoc(adRef);
    if (adSnap.exists()) {
      const { default: FinancingAdvertisement } = await import('./FinancingAdvertisement.js');
      return new FinancingAdvertisement({ id: adSnap.id, ...adSnap.data() });
    }
    return null;
  }
}

export default FinancingRequest;
