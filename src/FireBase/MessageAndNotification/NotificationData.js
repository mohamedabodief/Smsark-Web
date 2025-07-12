class NotificationData {
  constructor({
    receiver_id,
    title,
    body,
    timestamp,
    is_read,
    type,
    link
  }) {
    this.receiver_id = receiver_id;
    this.title = title;
    this.body = body;
    this.timestamp = timestamp;
    this.is_read = is_read ?? false; // افتراضيًا false
    this.type = type || 'general';   // تصنيف الإشعار: general, alert, message...
    this.link = link || null;        // رابط داخلي (اختياري)
  }
}

export default NotificationData;
