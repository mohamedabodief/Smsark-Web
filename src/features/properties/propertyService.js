
import { db } from "../../FireBase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";

export const fetchPropertiesFromFirebase = async () => {
  const querySnapshot = await getDocs(collection(db, 'properties'));
  const properties = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });
  return properties;
};
