import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyABZDrFUUlM4GBIg3WjqzqIn3Nz_aX6g-A",
  authDomain: "vesta-cafe-27ff1.firebaseapp.com",
  databaseURL: "https://vesta-cafe-27ff1-default-rtdb.firebaseio.com",
  projectId: "vesta-cafe-27ff1",
  storageBucket: "vesta-cafe-27ff1.firebasestorage.app",
  messagingSenderId: "1056761406205",
  appId: "1:1056761406205:web:19ad5393c9da20e19dd494",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
