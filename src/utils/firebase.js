import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signInWithFirebase(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken();
  return {
    accessToken: idToken,
    idToken,
    refreshToken: cred.user.refreshToken,
  };
}

export async function sendFirebasePasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutFirebase() {
  await signOut(auth);
}

export async function refreshFirebaseToken() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const idToken = await user.getIdToken(true);
    return { accessToken: idToken, idToken };
  } catch {
    return null;
  }
}

export function verifyUrlIdToken(idToken) {
  try {
    const payload = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const now = Math.floor(Date.now() / 1000);
    if (payload.aud !== import.meta.env.VITE_FIREBASE_PROJECT_ID) return { valid: false };
    if (payload.exp <= now) return { valid: false };
    return { valid: true, email: payload.email || '' };
  } catch {
    return { valid: false };
  }
}

export { auth };
