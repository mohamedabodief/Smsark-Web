class FinancingAdvertisementData {
  constructor({
    title,
    description,
    financing_model,
    image,
    phone,
    start_limit,
    end_limit,
    org_name,
    type_of_user,
    userId,
  }) {
    this.title = title;
    this.description = description;
    this.financing_model = financing_model;
    this.image = image;
    this.phone = phone;
    this.start_limit = start_limit;
    this.end_limit = end_limit;
    this.org_name = org_name;
    this.type_of_user = type_of_user; // دايمًا organization
    this.userId = userId;
  }
}

export default FinancingAdvertisementData;
