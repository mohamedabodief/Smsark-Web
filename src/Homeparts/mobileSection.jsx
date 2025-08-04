import React from 'react';

const MobileSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* الصورة اليسرى */}
      <div className="w-full md:w-1/4 flex justify-center mb-8 md:mb-0">
        <img 
          src="../assets/mobilepic2.png" // سيتم استبدال هذا المسار بالصورة الفعلية
          alt="عقارات مصر"
          className="max-h-64 md:max-h-96 rounded-lg shadow-lg"
        />
      </div>
      
      {/* النص الرئيسي */}
      <div className="w-full md:w-2/4 text-center px-4 md:px-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
حمّل تطبيق البحث عن العقارات الأكثر موثوقية في مصر
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
قم بتحميل تطبيق سمسارك العقاري الآن على هاتفك، وتمتع بعملية بحثٍ عن عقار أسهل،
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          حمل التطبيق الآن
        </button>
      </div>
      
      {/* الصورة اليمنى */}
      <div className="w-full md:w-1/4 flex justify-center mt-8 md:mt-0">
        <img 
          src="../assets/right-image.png" // سيتم استبدال هذا المسار بالصورة الفعلية
          alt="تطبيق إيروزي فليدز"
          className="max-h-64 md:max-h-96 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default MobileSection;