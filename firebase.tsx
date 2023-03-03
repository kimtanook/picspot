import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAm1Oo1wlRi_pfmI4hiS_Z-xSURpgsSrX0',
  authDomain: 'testpicspot.firebaseapp.com',
  projectId: 'testpicspot',
  storageBucket: 'testpicspot.appspot.com',
  messagingSenderId: '110955419725',
  appId: '1:110955419725:web:7fad0ffe45eb75af49e404',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
