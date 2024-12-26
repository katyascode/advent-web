import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './config';

const userLogin = async (email, password) => {
  const auth = getAuth(app);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export default userLogin;
