class RealEstateDeveloperData {
  constructor({
    developer_name,         // اسم المطور العقاري
    description,            // وصف عام للمطور أو المشروع
    project_types,          // مصفوفة: ["سكني", "تجاري", "سياحي"]
    images,                 // مصفوفة صور (روابط)
    phone,                  // رقم الهاتف
    location,               // كائن: { city, governorate }
    price_start_from,       // السعر يبدأ من كام
    price_end_to,           // السعر ينتهي عند كام
    userId,                 // معرف المستخدم
    type_of_user,           // نوع المستخدم - دايمًا "developer"
    rooms,                  // عدد الغرف (إن وُجد)
    bathrooms,              // عدد الحمامات (إن وُجد)
    floor,                  // رقم الدور (إن وُجد)
    furnished,              // هل الوحدة مفروشة؟
    status,                 // الحالة: "جاهز للسكن" أو "تحت الإنشاء"
    paymentMethod,          // طريقة الدفع (كاش / تقسيط / تمويل)
    negotiable,             // هل السعر قابل للتفاوض؟
    deliveryTerms,          // شروط التسليم (مثلاً: نصف تشطيب - تشطيب كامل)
    features,               // مصفوفة مميزات إضافية
    area,                   // المساحة بالمتر المربع (إن وُجد)
  }) {
    this.developer_name = developer_name || '';
    this.description = description || '';
    this.project_types = Array.isArray(project_types) ? project_types : [];
    this.images = Array.isArray(images) ? images : [];
    this.phone = phone || '';
    this.location = location || { city: '', governorate: '' };
    this.price_start_from = typeof price_start_from === 'number' ? price_start_from : null;
    this.price_end_to = typeof price_end_to === 'number' ? price_end_to : null;
    this.userId = userId || '';
    this.type_of_user = type_of_user || 'developer';
    this.rooms = typeof rooms === 'number' ? rooms : null;
    this.bathrooms = typeof bathrooms === 'number' ? bathrooms : null;
    this.floor = typeof floor === 'number' ? floor : null;
    this.furnished = furnished === true;
    this.status = status || null;
    this.paymentMethod = paymentMethod || null;
    this.negotiable = negotiable === true;
    this.deliveryTerms = deliveryTerms || null;
    this.features = Array.isArray(features) ? features : [];
    this.area = typeof area === 'number' ? area : null;
  }
}

export default RealEstateDeveloperData;
