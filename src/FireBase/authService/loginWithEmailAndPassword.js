import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';



export default async function loginWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return {
      success: true,
      uid: userCredential.user.uid,
      user: userCredential.user,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
