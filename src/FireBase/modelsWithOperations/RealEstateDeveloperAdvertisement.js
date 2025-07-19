// import {
//   collection,
//   addDoc,
//   doc,
//   getDoc,
//   deleteDoc,
//   updateDoc,
//   getDocs,
//   query,
//   where,
//   onSnapshot,
// } from 'firebase/firestore';
// import { db } from '../firebaseConfig';

// class RealEstateDeveloperAdvertisement {
//   #id = null;

//   constructor(data) {
//     this.#id = data.id || null;
//     this.developer_name = data.developer_name;
//     this.description = data.description;
//     this.project_types = data.project_types;
//     this.image = data.image;
//     this.phone = data.phone;
//     this.location = data.location;
//     this.website_url = data.website_url;
//     this.price_start_from = data.price_start_from;
//     this.price_end_to = data.price_end_to;
//     this.userId = data.userId;
//     this.type_of_user = data.type_of_user; // دايمًا developer
//     this.ads = data.ads !== undefined ? data.ads : false;
//     this.adExpiryTime = data.adExpiryTime || null;
//   }

//   get id() {
//     return this.#id;
//   }

//   async save() {
//     const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
//     const docRef = await addDoc(colRef, {
//       developer_name: this.developer_name,
//       description: this.description,
//       project_types: this.project_types,
//       image: this.image,
//       phone: this.phone,
//       location: this.location,
//       website_url: this.website_url,
//       price_start_from: this.price_start_from,
//       price_end_to: this.price_end_to,
//       userId: this.userId,
//       type_of_user: this.type_of_user,
//       ads: this.ads,
//       adExpiryTime: this.adExpiryTime,
//     });

//     this.#id = docRef.id;
//     await updateDoc(docRef, { id: this.#id }); // حفظ id داخليًا
//     return this.#id;
//   }

//   async update(updates) {
//     if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
//     const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
//     await updateDoc(docRef, updates);
//   }

//   async delete() {
//     if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
//     const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
//     await deleteDoc(docRef);
//   }

//   async removeAds() {
//     if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
//     this.ads = false;
//     this.adExpiryTime = null;
//     await this.update({ ads: false, adExpiryTime: null });
//   }

//   async adsActivation(days) {
//     if (!this.#id) throw new Error('الإعلان بدون ID صالح لتفعيل الإعلانات');
//     const ms = days * 24 * 60 * 60 * 1000;
//     this.ads = true;
//     this.adExpiryTime = Date.now() + ms;
//     await this.update({ ads: true, adExpiryTime: this.adExpiryTime });

//     setTimeout(() => this.removeAds().catch((e) => console.error(e)), ms);
//   }
// static async getAll() {
//   const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
//   const snapshot = await getDocs(colRef); 
//   const allAds = [];
//   for (const docSnap of snapshot.docs) {
//     allAds.push(new RealEstateDeveloperAdvertisement(docSnap.data()));
//   }
//   return allAds;
// }

//   static async getById(id) {
//     const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
//     const snapshot = await getDoc(docRef);
//     if (snapshot.exists()) {
//       return await RealEstateDeveloperAdvertisement.#handleExpiry(
//         snapshot.data()
//       );
//     }
//     return null;
//   }

//   static async #handleExpiry(data) {
//     const now = Date.now();
//     if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
//       data.ads = false;
//       data.adExpiryTime = null;
//       const docRef = doc(db, 'RealEstateDeveloperAdvertisements', data.id);
//       await updateDoc(docRef, { ads: false, adExpiryTime: null });
//     }
//     return new RealEstateDeveloperAdvertisement(data);
//   }

//   /**
//    * الاستماع اللحظي لإعلانات المطورين النشطة فقط
//    */
//   static subscribeActiveAds(callback) {
//     const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
//     const q = query(colRef, where('ads', '==', true));
//     return onSnapshot(q, async (querySnapshot) => {
//       const ads = [];
//       for (const docSnap of querySnapshot.docs) {
//         ads.push(
//           await RealEstateDeveloperAdvertisement.#handleExpiry(docSnap.data())
//         );
//       }
//       callback(ads);
//     });
//   }

//   /**
//    * جلب جميع إعلانات المطورين العقاريين
//    */
//   static async getAll() {
//     const { getDocs, collection } = await import('firebase/firestore');
//     const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
//     const snapshot = await getDocs(colRef);
//     const ads = [];
//     for (const docSnap of snapshot.docs) {
//       const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(
//         docSnap.data()
//       );
//       if (ad) ads.push(ad); // استبعاد اللي انتهت صلاحيتهم وتم إيقافهم
//     }
//     return ads;
//   }

//   /**
//    * جلب جميع إعلانات مطور معيّن حسب userId
//    */
//   static async getByUserId(userId) {
//     const { getDocs, collection, where, query } = await import(
//       'firebase/firestore'
//     );
//     const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
//     const q = query(colRef, where('userId', '==', userId));
//     const snapshot = await getDocs(q);
//     const ads = [];
//     for (const docSnap of snapshot.docs) {
//       const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(
//         docSnap.data()
//       );
//       if (ad) ads.push(ad);
//     }
//     return ads;
//   }

//   /**
//    * جلب الإعلانات النشطة فقط المرتبطة بمطور معيّن
//    */
//   static async getActiveByUser(userId) {
//     const { getDocs, collection, where, query } = await import(
//       'firebase/firestore'
//     );
//     const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
//     const q = query(
//       colRef,
//       where('userId', '==', userId),
//       where('ads', '==', true)
//     );
//     const snapshot = await getDocs(q);
//     const ads = [];
//     for (const docSnap of snapshot.docs) {
//       const ad = await RealEstateDeveloperAdvertisement.#handleExpiry(
//         docSnap.data()
//       );
//       if (ad) ads.push(ad);
//     }
//     return ads;
//   }
// }

// export default RealEstateDeveloperAdvertisement;
// src/FireBase/modelsWithOperations/RealEstateDeveloperAdvertisement.js

import {
    collection,
    addDoc,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    getDocs,
    query,
    where,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust path to your firebaseConfig

class RealEstateDeveloperAdvertisement {
    #id = null;

    constructor(data) {
        this.#id = data.id || null; // Use provided ID or null
        this.developer_name = data.developer_name;
        this.description = data.description;
        this.project_types = data.project_types;
        this.image = data.image;
        this.phone = data.phone;
        this.location = data.location;
        this.website_url = data.website_url;
        this.price_start_from = data.price_start_from;
        this.price_end_to = data.price_end_to;
        this.userId = data.userId;
        this.type_of_user = data.type_of_user; // دايمًا developer
        this.ads = data.ads !== undefined ? data.ads : false; // Default to false if not provided
        this.adExpiryTime = data.adExpiryTime || null;
    }

    get id() {
        return this.#id;
    }

    async save() {
        const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
        const docRef = await addDoc(colRef, {
            developer_name: this.developer_name,
            description: this.description,
            project_types: this.project_types,
            image: this.image,
            phone: this.phone,
            location: this.location,
            website_url: this.website_url,
            price_start_from: this.price_start_from,
            price_end_to: this.price_end_to,
            userId: this.userId,
            type_of_user: this.type_of_user,
            ads: this.ads,
            adExpiryTime: this.adExpiryTime,
        });

        this.#id = docRef.id;
        await updateDoc(docRef, { id: this.#id }); // Save id internally
        return this.#id;
    }

    async update(updates) {
        if (!this.#id) throw new Error('الإعلان بدون ID صالح للتحديث');
        const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
        await updateDoc(docRef, updates);
    }

    async delete() {
        if (!this.#id) throw new Error('الإعلان بدون ID صالح للحذف');
        const docRef = doc(db, 'RealEstateDeveloperAdvertisements', this.#id);
        await deleteDoc(docRef);
    }

    async removeAds() {
        if (!this.#id) throw new Error('الإعلان بدون ID صالح لإيقاف الإعلانات');
        this.ads = false;
        this.adExpiryTime = null;
        await this.update({ ads: false, adExpiryTime: null });
    }

    async adsActivation(days) {
        if (!this.#id) throw new Error('الإعلان بدون ID صالح لتفعيل الإعلانات');
        const ms = days * 24 * 60 * 60 * 1000;
        this.ads = true;
        this.adExpiryTime = Date.now() + ms;
        await this.update({ ads: true, adExpiryTime: this.adExpiryTime });

        // Schedule removal after expiry
        setTimeout(() => {
            // Re-fetch the ad to ensure we have the latest state before attempting to remove
            RealEstateDeveloperAdvertisement.getById(this.#id)
                .then(adData => {
                    if (adData && adData.ads) { // Only remove if it's still active
                        const tempInstance = new RealEstateDeveloperAdvertisement(adData);
                        tempInstance.removeAds().catch(e => console.error("Error removing expired ad:", e));
                    }
                })
                .catch(e => console.error("Error fetching ad for expiry check:", e));
        }, ms);
    }

    static async getAll() {
        const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
        const snapshot = await getDocs(colRef);
        const allAds = [];
        for (const docSnap of snapshot.docs) {
            const adData = docSnap.data();
            // Ensure ID is included and handle expiry, returning plain object
            const processedAd = await RealEstateDeveloperAdvertisement.#handleExpiry({ id: docSnap.id, ...adData });
            if (processedAd) allAds.push(processedAd);
        }
        return allAds;
    }

    static async getById(id) {
        const docRef = doc(db, 'RealEstateDeveloperAdvertisements', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            // Pass doc.id to handleExpiry and return plain object
            return await RealEstateDeveloperAdvertisement.#handleExpiry({ id: snapshot.id, ...snapshot.data() });
        }
        return null;
    }

    // Private helper to handle ad expiry and return a plain object
    static async #handleExpiry(data) {
        const now = Date.now();
        // Check if ad is active AND has an expiry time AND has expired
        if (data.ads === true && data.adExpiryTime && data.adExpiryTime <= now) {
            console.log(`Ad ${data.id} expired. Setting 'ads' to false.`);
            // Update Firestore directly for the expired ad
            const docRef = doc(db, 'RealEstateDeveloperAdvertisements', data.id);
            await updateDoc(docRef, { ads: false, adExpiryTime: null });
            // Return the updated state as a plain object
            return { ...data, ads: false, adExpiryTime: null };
        }
        // If not expired or already inactive, return the data as is (as a plain object)
        return { ...data };
    }

    /**
     * الاستماع اللحظي لإعلانات المطورين النشطة فقط
     * @param {function(Array<Object>): void} callback - Callback function to receive the array of active ads (plain objects).
     * @param {function(Error): void} errorCallback - Callback function to handle errors.
     */
    static subscribeActiveAds(callback, errorCallback) {
        const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
        const q = query(colRef, where('ads', '==', true)); // Only listen for currently active ads

        return onSnapshot(q, async (querySnapshot) => {
            const ads = [];
            for (const docSnap of querySnapshot.docs) {
                const adData = docSnap.data();
                // Ensure doc.id is included and handle expiry, returning plain object
                const processedAd = await RealEstateDeveloperAdvertisement.#handleExpiry({ id: docSnap.id, ...adData });
                // Only push if the ad is still active after expiry check
                if (processedAd && processedAd.ads === true) {
                    ads.push(processedAd);
                }
            }
            callback(ads);
        }, (error) => {
            console.error("Firestore subscription error for developer ads:", error);
            if (errorCallback) {
                errorCallback(error);
            }
        });
    }

    /**
     * جلب جميع إعلانات المطورين العقاريين
     */
    static async getAll() {
        const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
        const snapshot = await getDocs(colRef);
        const ads = [];
        for (const docSnap of snapshot.docs) {
            const adData = docSnap.data();
            const ad = await RealEstateDeveloperAdvertisement.#handleExpiry({ id: docSnap.id, ...adData });
            if (ad) ads.push(ad);
        }
        return ads;
    }

    /**
     * جلب جميع إعلانات مطور معيّن حسب userId
     */
    static async getByUserId(userId) {
        const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
        const q = query(colRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const ads = [];
        for (const docSnap of snapshot.docs) {
            const adData = docSnap.data();
            const ad = await RealEstateDeveloperAdvertisement.#handleExpiry({ id: docSnap.id, ...adData });
            if (ad) ads.push(ad);
        }
        return ads;
    }

    /**
     * جلب الإعلانات النشطة فقط المرتبطة بمطور معيّن
     */
    static async getActiveByUser(userId) {
        const colRef = collection(db, 'RealEstateDeveloperAdvertisements');
        const q = query(
            colRef,
            where('userId', '==', userId),
            where('ads', '==', true)
        );
        const snapshot = await getDocs(q);
        const ads = [];
        for (const docSnap of snapshot.docs) {
            const adData = docSnap.data();
            const ad = await RealEstateDeveloperAdvertisement.#handleExpiry({ id: docSnap.id, ...adData });
            if (ad && ad.ads === true) ads.push(ad); // Ensure it's still active after expiry check
        }
        return ads;
    }
}

export default RealEstateDeveloperAdvertisement;
