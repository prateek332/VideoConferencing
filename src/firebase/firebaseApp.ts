import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import appConfig from '../app.config';

function initializeFirebase() {
  const app = initializeApp(appConfig.firebaseConfig);
  const db = getFirestore(app);
  return [app, db];
}

export default initializeFirebase;