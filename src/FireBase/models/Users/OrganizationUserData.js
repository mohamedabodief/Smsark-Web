class OrganizationUserData {
  constructor({ uid, org_name, type_of_organization, phone, image, city, governorate, address }) {
    this.uid = uid;
    this.type_of_user = "organization";
    this.org_name = org_name;
    this.type_of_organization = type_of_organization;
    this.phone = phone;
    this.image = image;
    this.city = city;
    this.governorate = governorate;
    this.address = address;
  }
}

export default OrganizationUserData;