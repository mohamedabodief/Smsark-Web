import { useEffect } from 'react';
import ClientAdvertisement from '../FireBase/modelsWithOperations/ClientAdvertisemen';

function AddMultipleAdsOnce() {
  useEffect(() => {
    const addAds = async () => {
      const dummyAds = [
        {
          title: 'شقة للبيع في المعادي',
          type: 'شقة',
          price: 1500000,
          area: 120,
          date_of_building: '2015',
          images: ['https://via.placeholder.com/400'],
          location: { lat: 29.960, lng: 31.259 },
          address: 'شارع 9، المعادي',
          city: 'القاهرة',
          governorate: 'القاهرة',
          phone: '01001234567',
          user_name: 'أحمد علي',
          userId: 'user_123',
          ad_type: 'بيع',
          ad_status: 'تحت العرض',
          type_of_user: 'client',
          ads: true,
          adExpiryTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
          description: `
هذه الشقة الرائعة تقع في قلب المعادي بشارع 9 الحيوي، وتتميز بتصميم عصري وتشطيب سوبر لوكس باستخدام أفضل الخامات. الشقة تطل على شارع واسع وتتمتع بإضاءة طبيعية ممتازة طوال اليوم. تحتوي على 3 غرف نوم واسعة، و2 حمام بتجهيزات حديثة، ومطبخ أمريكي مفتوح على الريسبشن.

تقع الشقة في منطقة هادئة وقريبة من المترو والمدارس الدولية والمولات التجارية. يوجد أيضاً جراج خاص للسكان، وأمن على مدار الساعة، مما يجعلها مثالية للعائلات الباحثة عن الراحة والخصوصية. جميع المرافق متوفرة مثل المياه والغاز الطبيعي والتكييفات.

الشقة متاحة للبيع الفوري والتفاوض على السعر ممكن في حالة الجدية.
    `,
        },
        {
          title: 'فيلا للإيجار في الشيخ زايد',
          type: 'فيلا',
          price: 20000,
          area: 300,
          date_of_building: '2018',
          images: ['https://via.placeholder.com/400'],
          location: { lat: 30.027, lng: 31.014 },
          address: 'الشيخ زايد الحي السابع',
          city: 'الجيزة',
          governorate: 'الجيزة',
          phone: '01004567890',
          user_name: 'منى عبد الله',
          userId: 'user_456',
          ad_type: 'إيجار',
          ad_status: 'تحت التفاوض',
          type_of_user: 'client',
          ads: true,
          adExpiryTime: Date.now() + 5 * 24 * 60 * 60 * 1000,
          description: `
فيلا مفروشة للإيجار في واحدة من أرقى مناطق الشيخ زايد. الفيلا تقع في الحي السابع على بعد دقائق من أركان بلازا وأمريكانا بلازا، وتتميز بتصميم معماري فخم وحديقة خاصة واسعة.

تتكون الفيلا من 3 طوابق تشمل 4 غرف نوم، 4 حمامات، غرفة معيشة، ريسبشن كبير، مطبخ كامل بالأجهزة، وغرفة خادمة. يوجد بالفيلا نظام تكييف مركزي، وسخان مركزي، وكاميرات مراقبة.

الإيجار يشمل الأثاث الكامل، وأجهزة كهربائية حديثة، مع إمكانية التفاوض على مدة الإيجار. الفيلا مثالية للعائلات أو الأجانب الباحثين عن مستوى سكني راقٍ وخدمات متكاملة.
    `,
        },
        {
          title: 'محل تجاري للبيع في مدينة نصر',
          type: 'محل',
          price: 2500000,
          area: 100,
          date_of_building: '2020',
          images: ['https://via.placeholder.com/400'],
          location: { lat: 30.068, lng: 31.330 },
          address: 'شارع مصطفى النحاس',
          city: 'القاهرة',
          governorate: 'القاهرة',
          phone: '01112345678',
          user_name: 'سامي خليل',
          userId: 'user_789',
          ad_type: 'بيع',
          ad_status: 'تحت العرض',
          type_of_user: 'client',
          ads: true,
          adExpiryTime: Date.now() + 3 * 24 * 60 * 60 * 1000,
          description: `
محل تجاري للبيع في موقع استراتيجي على شارع مصطفى النحاس بمدينة نصر. يتمتع المحل بواجهة زجاجية كبيرة، ومساحة مفتوحة قابلة للتقسيم حسب النشاط التجاري. المحل مؤهل لأي نشاط مثل ملابس، صيدلية، مكتب، أو مطعم.

يوجد عداد كهرباء ومياه، وتم تأسيس شبكة إنترنت داخلي. المنطقة المحيطة تشهد حركة مرورية عالية، ويوجد مواقف سيارات قريبة.

يتميز العقار بسهولة الوصول إليه من مختلف أحياء القاهرة، وقربه من المواصلات العامة، مما يجعله فرصة ذهبية للاستثمار.
    `,
        }
      ];


      try {
        for (const data of dummyAds) {
          const ad = new ClientAdvertisement(data); // بدون override
          const id = await ad.save();
          console.log(`✅ تمت إضافة إعلان "${data.title}" برقم ID: ${id}`);
        
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
