import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBFvyZWuGs9QhnRO3elDmPIysIMVoBAvpk',
  authDomain: 'picspotofficial-2fb64.firebaseapp.com',
  projectId: 'picspotofficial-2fb64',
  storageBucket: 'picspotofficial-2fb64.appspot.com',
  messagingSenderId: '82538335068',
  appId: '1:82538335068:web:ebc6eb85897161f6a68f99',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
