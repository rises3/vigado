import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDz4uSeUelnBtqc9ontXYdV1RbCIze7tjY',
  authDomain: 'vigado-admin.firebaseapp.com',
  projectId: 'vigado-admin',
  storageBucket: 'vigado-admin.firebasestorage.app',
  messagingSenderId: '234014348905',
  appId: '1:234014348905:web:c47347be3905c772bab4f8',
  measurementId: 'G-48VQQRK173',
};

export const firebaseApp = initializeApp(firebaseConfig);

export async function initializeAnalytics(): Promise<void> {
  if (await isSupported()) {
    getAnalytics(firebaseApp);
  }
}
