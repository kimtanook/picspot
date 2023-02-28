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

// apiKey: 'AIzaSyAm1Oo1wlRi_pfmI4hiS_Z-xSURpgsSrX0',
// authDomain: 'testpicspot.firebaseapp.com',
// projectId: 'testpicspot',
// storageBucket: 'testpicspot.appspot.com',
// messagingSenderId: '110955419725',
// appId: '1:110955419725:web:7fad0ffe45eb75af49e404',

// apiKey: 'AIzaSyC3lI52U435rGzI0LQQ8RcSziDW_9pV8pM',
// authDomain: 'ts-todoself.firebaseapp.com',
// projectId: 'ts-todoself',
// storageBucket: 'ts-todoself.appspot.com',
// messagingSenderId: '772320960122',
// appId: '1:772320960122:web:9c0b5f6445d950151ba5c3',

// 도훈님
// apiKey: 'AIzaSyB55_CpuAdFJS3NNtifXSZR5mDaWP_HT2E',
// authDomain: 'picspot2.firebaseapp.com',
// projectId: 'picspot2',
// storageBucket: 'picspot2.appspot.com',
// messagingSenderId: '32694262243',
// appId: '1:32694262243:web:c366d0f0a141da0c8f68d6',

// 기동sla picspot22
// apiKey: "AIzaSyC0ZFhe2fsGDxsiXg8zCZIkwr3d3vGpo20",
// authDomain: "picspot22-a7280.firebaseapp.com",
// projectId: "picspot22-a7280",
// storageBucket: "picspot22-a7280.appspot.com",
// messagingSenderId: "1015895283247",
// appId: "1:1015895283247:web:f960a7398c0b46de5798da",

// official
// apiKey: 'AIzaSyCxKx4AXNnQpn6q6fFK6VxvTMEgKChM10o',
//   authDomain: 'picspot-2e239.firebaseapp.com',
//   projectId: 'picspot-2e239',
//   storageBucket: 'picspot-2e239.appspot.com',
//   messagingSenderId: '250271284271',
//   appId: '1:250271284271:web:967a7916cc654f6f39dada',

// test
// apiKey: "AIzaSyAm1Oo1wlRi_pfmI4hiS_Z-xSURpgsSrX0",
//   authDomain: "testpicspot.firebaseapp.com",
//   projectId: "testpicspot",
//   storageBucket: "testpicspot.appspot.com",
//   messagingSenderId: "110955419725",
//   appId: "1:110955419725:web:7fad0ffe45eb75af49e404"

// picspot33
// apiKey: "AIzaSyC_hPhusKHFzK9txrOrF3Ry_UDojdG3ehI",
// authDomain: "picspot33-d70df.firebaseapp.com",
// projectId: "picspot33-d70df",
// storageBucket: "picspot33-d70df.appspot.com",
// messagingSenderId: "1071145662979",
// appId: "1:1071145662979:web:b0ad278354defe1ffdec36"
