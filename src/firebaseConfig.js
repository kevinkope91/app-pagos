import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB6sYzhtUBORex9eB1RB5ZOKoRCMKFybTY',
  authDomain: 'app-pagos-6e9cc.firebaseapp.com',
  projectId: 'app-pagos-6e9cc',
  storageBucket: 'app-pagos-6e9cc.appspot.com',
  messagingSenderId: '897082450244',
  appId: '1:897082450244:web:9c8f236e7a9360d19b7711',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
