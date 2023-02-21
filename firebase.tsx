import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC3lI52U435rGzI0LQQ8RcSziDW_9pV8pM',
  authDomain: 'ts-todoself.firebaseapp.com',
  projectId: 'ts-todoself',
  storageBucket: 'ts-todoself.appspot.com',
  messagingSenderId: '772320960122',
  appId: '1:772320960122:web:9c0b5f6445d950151ba5c3',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };

// apiKey: 'AIzaSyC3lI52U435rGzI0LQQ8RcSziDW_9pV8pM',
// authDomain: 'ts-todoself.firebaseapp.com',
// projectId: 'ts-todoself',
// storageBucket: 'ts-todoself.appspot.com',
// messagingSenderId: '772320960122',
// appId: '1:772320960122:web:9c0b5f6445d950151ba5c3',
