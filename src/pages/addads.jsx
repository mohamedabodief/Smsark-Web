import { useEffect } from 'react';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';

function AddMultipleAdsOnce() {
  useEffect(() => {
    const addAds = async () => {
      const adsData = [
        {
          title: 'شقة 120م في المعادي',
          type: 'شقة',
          price: 1000000,
          area: 120,
          date_of_building: '2017',
          images: ['https://realestate.eg/ckfinder/userfiles/images/Villas-in-fifth-settlement/%D9%81%D9%8A%D9%84%D8%A7%D8%AA%20%D9%84%D9%84%D8%A8%D9%8A%D8%B9%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D8%B9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3.jpg','https://realestate.eg/ckfinder/userfiles/images/Villas-in-fifth-settlement/%D9%81%D9%84%D9%84%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D8%B9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3.jpg','https://www.alessamy.com/upload/properties/a_e_%D9%88%D8%AC%D9%87%D8%A7%D8%AA_%D9%81%D9%8A%D9%84%D8%A7_%D8%BA%D8%B1%D8%A8_%D8%A7%D9%84%D8%AC%D9%88%D9%84%D9%81_18666.jpg'],
          location: { lat: 30.05, lng: 31.23 },
          address: 'شارع 9، المعادي',
          city: 'القاهرة',
          governorate: 'القاهرة',
          phone: '01012345678',
          user_name: 'آلاء',
          userId: 'user_1',
          ad_status:'بيع'
        },
        {
          title: 'فيلا راقية في الشيخ زايد',
          type: 'فيلا',
          price: 5000000,
          area: 300,
          date_of_building: '2020',
          images: ['https://realestate.eg/ckfinder/userfiles/images/Villas-in-fifth-settlement/%D9%81%D9%8A%D9%84%D8%A7%D8%AA%20%D9%84%D9%84%D8%A8%D9%8A%D8%B9%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D8%B9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3.jpg','https://realestate.eg/ckfinder/userfiles/images/Villas-in-fifth-settlement/%D9%81%D9%84%D9%84%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D8%B9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3.jpg','https://www.alessamy.com/upload/properties/a_e_%D9%88%D8%AC%D9%87%D8%A7%D8%AA_%D9%81%D9%8A%D9%84%D8%A7_%D8%BA%D8%B1%D8%A8_%D8%A7%D9%84%D8%AC%D9%88%D9%84%D9%81_18666.jpg'],
          location: { lat: 30.1, lng: 31.2 },
          address: 'الحي الثامن، زايد',
          city: 'الجيزة',
          governorate: 'الجيزة',
          phone: '01123456789',
          user_name: 'آلاء',
          userId: 'user_2',
          ad_status:'بيع'
        },
        {
          title: 'محل تجاري في وسط البلد',
          type: 'محل',
          price: 2000000,
          area: 50,
          date_of_building: '2010',
          images: ['https://realestate.eg/ckfinder/userfiles/images/Villas-in-fifth-settlement/%D9%81%D9%8A%D9%84%D8%A7%D8%AA%20%D9%84%D9%84%D8%A8%D9%8A%D8%B9%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D8%B9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3.jpg','https://realestate.eg/ckfinder/userfiles/images/Villas-in-fifth-settlement/%D9%81%D9%84%D9%84%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D8%B9%20%D8%A7%D9%84%D8%AE%D8%A7%D9%85%D8%B3.jpg','https://www.alessamy.com/upload/properties/a_e_%D9%88%D8%AC%D9%87%D8%A7%D8%AA_%D9%81%D9%8A%D9%84%D8%A7_%D8%BA%D8%B1%D8%A8_%D8%A7%D9%84%D8%AC%D9%88%D9%84%D9%81_18666.jpg'],
          location: { lat: 30.045, lng: 31.24 },
          address: 'شارع طلعت حرب',
          city: 'القاهرة',
          governorate: 'القاهرة',
          phone: '01234567890',
          user_name: 'آلاء',
          userId: 'user_3',
        },
      ];

      try {
        for (const data of adsData) {
          const ad = new ClientAdvertisement({
            ...data,
            ad_type: 'بيع',
            ad_status: 'تحت العرض',
            type_of_user: 'client',
            ads: false,
            adExpiryTime: null,
          });

          const id = await ad.save();
          console.log(`تمت إضافة إعلان "${data.title}" برقم ID: ${id}`);
        }
      } catch (err) {
        console.error('خطأ أثناء إضافة الإعلانات:', err.message);
      }
    };

    addAds();
  }, []);

  return null; 
}

export default AddMultipleAdsOnce;
