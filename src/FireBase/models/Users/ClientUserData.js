class ClientUserData {
  constructor({ uid, cli_name, phone, gender, age, image, city, governorate, address }) {
    this.uid = uid;
    this.type_of_user = "client";
    this.cli_name = cli_name;
    this.phone = phone;
    this.gender = gender;
    this.age = age;
    this.image = image;
    this.city = city;
    this.governorate = governorate;
    this.address = address;
  }
}

export default ClientUserData;