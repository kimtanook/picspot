import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCxKx4AXNnQpn6q6fFK6VxvTMEgKChM10o',
  authDomain: 'picspot-2e239.firebaseapp.com',
  projectId: 'picspot-2e239',
  storageBucket: 'picspot-2e239.appspot.com',
  messagingSenderId: '250271284271',
  appId: '1:250271284271:web:967a7916cc654f6f39dada',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
