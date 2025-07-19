class AdminUserData {
  constructor({ uid, adm_name, phone, gender, image }) {
    this.uid = uid;
    this.type_of_user = "admin";
    this.adm_name = adm_name;
    this.phone = phone;
    this.gender = gender;
    this.image = image;
  }
}

export default AdminUserData;

// class MessageData {
//   constructor({ sender_id, receiver_id, content, timestamp, is_read }) {
//     this.sender_id = sender_id;
//     this.receiver_id = receiver_id;
//     this.content = content;
//     this.timestamp = timestamp;
//     this.is_read = is_read ?? false; // افتراضيًا false لو مش متحددة
//   }
// }

// export default MessageData;