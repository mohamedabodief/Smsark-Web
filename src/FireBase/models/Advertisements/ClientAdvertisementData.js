class ClientAdvertisementData {
  constructor({
    title,
    type,
    // type: "apartment" | "villa" | "commercial"
    price,
    area,
    date_of_building,
    images,
    location,
    address,
    city,
    governorate,
    phone,
    description,
    user_name,
    userId,
    ad_type = "بيع",             // القيمة الافتراضية
    ad_status = "تحت العرض",     // القيمة الافتراضية
  }) {
    this.title = title;
    this.type = type;
    this.price = price;
    this.area = area;
    this.date_of_building = date_of_building;
    this.images = images;
    this.location = location;
    this.address = address;
    this.city = city;
    this.governorate = governorate;
    this.phone = phone;
    this.user_name = user_name;
    this.userId = userId;
    this.description = description;
    this.ad_type = ad_type;
    // القيم المحتملة: "بيع" | "إيجار" | "شراء"

    this.ad_status = ad_status;
    // القيم المحتملة: "تحت العرض" | "تحت التفاوض" | "منتهي"

    this.type_of_user = "client";
  }
}

export default ClientAdvertisementData;
