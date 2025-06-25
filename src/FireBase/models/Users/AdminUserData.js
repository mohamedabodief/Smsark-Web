class AdminUserData {
  constructor({ uid, adm_name, phone, gender, user_name, image }) {
    this.uid = uid;
    this.type_of_user = "admin";
    this.adm_name = adm_name;
    this.phone = phone;
    this.gender = gender;
    this.user_name = user_name;
    this.image = image;
  }
}

export default AdminUserData;