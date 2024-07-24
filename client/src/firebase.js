import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAuIr-TWtE0eVkgKNr9JhSt2YTGUGybjM",
  authDomain: "ecommerce-test-task.firebaseapp.com",
  projectId: "ecommerce-test-task",
  storageBucket: "ecommerce-test-task.appspot.com",
  messagingSenderId: "133926322187",
  appId: "1:133926322187:web:f07796491f2ee935a7070e",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
