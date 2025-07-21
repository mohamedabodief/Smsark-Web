import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "./FireBase/firebaseConfig";
import { setAuthUserData, logout } from "./LoginAndRegister/featuresLR/authSlice";
import { onAuthStateChanged } from "firebase/auth";
import User from "./FireBase/modelsWithOperations/User";

function AuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userData = await User.getByUid(user.uid);
        if (userData) {
          dispatch(setAuthUserData({
            uid: userData.uid,
            type_of_user: userData.type_of_user,
            type_of_organization: userData.type_of_organization || null,
            adm_name: userData.adm_name || null,
          }));
        }
      } else {
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return null; // This component does not render anything
}

export default AuthSync; 