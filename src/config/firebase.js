import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDx5QrZOvWex9L-rx8dxLijcBE7Ou87PW0",
  authDomain: "filmtherv3.firebaseapp.com",
  projectId: "filmtherv3",
  storageBucket: "filmtherv3.firebasestorage.app",
  messagingSenderId: "533105449260",
  appId: "1:533105449260:web:33737b21684ef0b7043489",
  measurementId: "G-LMX9BS6ZEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics }; 