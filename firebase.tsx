import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDLGl2U1Mr6y014lyHUJbQza7OLym6gmAc',
  authDomain: 'picspot-test1.firebaseapp.com',
  projectId: 'picspot-test1',
  storageBucket: 'picspot-test1.appspot.com',
  messagingSenderId: '194196294348',
  appId: '1:194196294348:web:fa3f70cf6e6db5a1c65069',
};

const app = initializeApp(firebaseConfig);
const authService = getAuth(app);
const dbService = getFirestore(app);
const storageService = getStorage(app);

export { app, authService, dbService, storageService };

// apiKey: "AIzaSyDLGl2U1Mr6y014lyHUJbQza7OLym6gmAc",
// authDomain: "picspot-test1.firebaseapp.com",
// projectId: "picspot-test1",
// storageBucket: "picspot-test1.appspot.com",
// messagingSenderId: "194196294348",
// appId: "1:194196294348:web:fa3f70cf6e6db5a1c65069"

// apiKey: "AIzaSyBFvyZWuGs9QhnRO3elDmPIysIMVoBAvpk",
//     authDomain: "picspotofficial-2fb64.firebaseapp.com",
//     projectId: "picspotofficial-2fb64",
//     storageBucket: "picspotofficial-2fb64.appspot.com",
//     messagingSenderId: "82538335068",
//     appId: "1:82538335068:web:ebc6eb85897161f6a68f99"

//   apiKey: 'AIzaSyC0ZFhe2fsGDxsiXg8zCZIkwr3d3vGpo20',
// authDomain: 'picspot22-a7280.firebaseapp.com',
// projectId: 'picspot22-a7280',
// storageBucket: 'picspot22-a7280.appspot.com',
// messagingSenderId: '1015895283247',
// appId: '1:1015895283247:web:f960a7398c0b46de5798da',

// apiKey: "AIzaSyAm1Oo1wlRi_pfmI4hiS_Z-xSURpgsSrX0",
//   authDomain: "testpicspot.firebaseapp.com",
//   projectId: "testpicspot",
//   storageBucket: "testpicspot.appspot.com",
//   messagingSenderId: "110955419725",
//   appId: "1:110955419725:web:7fad0ffe45eb75af49e404"
