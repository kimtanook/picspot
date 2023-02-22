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

// apiKey: 'AIzaSyC3lI52U435rGzI0LQQ8RcSziDW_9pV8pM',
// authDomain: 'ts-todoself.firebaseapp.com',
// projectId: 'ts-todoself',
// storageBucket: 'ts-todoself.appspot.com',
// messagingSenderId: '772320960122',
// appId: '1:772320960122:web:9c0b5f6445d950151ba5c3',

// apiKey: 'AIzaSyCxKx4AXNnQpn6q6fFK6VxvTMEgKChM10o',
//   authDomain: 'picspot-2e239.firebaseapp.com',
//   projectId: 'picspot-2e239',
//   storageBucket: 'picspot-2e239.appspot.com',
//   messagingSenderId: '250271284271',
//   appId: '1:250271284271:web:967a7916cc654f6f39dada',

// apiKey: "AIzaSyAm1Oo1wlRi_pfmI4hiS_Z-xSURpgsSrX0",
//   authDomain: "testpicspot.firebaseapp.com",
//   projectId: "testpicspot",
//   storageBucket: "testpicspot.appspot.com",
//   messagingSenderId: "110955419725",
//   appId: "1:110955419725:web:7fad0ffe45eb75af49e404"
