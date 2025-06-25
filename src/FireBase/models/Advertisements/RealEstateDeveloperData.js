class RealEstateDeveloperData {
  constructor({
    developer_name,
    description,
    project_types, // مصفوفة مثلاً: ["سكني", "تجاري", "سياحي"]
    image,
    phone,
    location, // { city, governorate }
    website_url,
    price_start_from, // السعر يبدأ من كام
    price_end_to,     // السعر ينتهي عند كام
    userId,
    type_of_user,
  }) {
    this.developer_name = developer_name;
    this.description = description;
    this.project_types = project_types;
    this.image = image;
    this.phone = phone;
    this.location = location;
    this.website_url = website_url || null;
    this.price_start_from = price_start_from;
    this.price_end_to = price_end_to;
    this.userId = userId;
    this.type_of_user = type_of_user; // دايمًا "developer"
  }
}

export default RealEstateDeveloperData;
