import * as firebase from 'firebase';
import '@firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_uZzhBtaH6vIZzVj_jWywlFRz_1Pv1yk",
  authDomain: "infinite-line-294820.firebaseapp.com",
  projectId: "infinite-line-294820",
  storageBucket: "infinite-line-294820.appspot.com",
  messagingSenderId: "349253517354",
  appId: "1:349253517354:web:6f2357201d921edfa60353"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export { firebase };