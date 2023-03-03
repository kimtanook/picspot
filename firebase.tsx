import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC0ZFhe2fsGDxsiXg8zCZIkwr3d3vGpo20',
  authDomain: 'picspot22-a7280.firebaseapp.com',
  projectId: 'picspot22-a7280',
  storageBucket: 'picspot22-a7280.appspot.com',
  messagingSenderId: '1015895283247',
  appId: '1:1015895283247:web:f960a7398c0b46de5798da',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };
