import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default async function registerWithEmailAndPassword(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
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
