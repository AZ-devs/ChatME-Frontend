import * as firebase from 'firebase';
import '@firebase/storage';

// abd backup
// const firebaseConfig = {
//   apiKey: "AIzaSyB_VcCVtOt88O-VX9ooIht61iH0YQN3zjA",
//   authDomain: "zatar-3a483.firebaseapp.com",
//   projectId: "zatar-3a483",
//   storageBucket: "zatar-3a483.appspot.com",
//   messagingSenderId: "936436020113",
//   appId: "1:936436020113:web:7a52fc3869c4c6d8aae030"
// };

// backup zak
const firebaseConfig = {
  apiKey: "AIzaSyBLOEkB7p47xqNv44SD1OgAWaMyDFBCCv0",
  authDomain: "chatme-daf04.firebaseapp.com",
  projectId: "chatme-daf04",
  storageBucket: "chatme-daf04.appspot.com",
  messagingSenderId: "541507931463",
  appId: "1:541507931463:web:25330594a141388509d062"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export { firebase };



// old
// const firebaseConfig = {
//   apiKey: "AIzaSyC_uZzhBtaH6vIZzVj_jWywlFRz_1Pv1yk",
//   authDomain: "infinite-line-294820.firebaseapp.com",
//   projectId: "infinite-line-294820",
//   storageBucket: "infinite-line-294820.appspot.com",
//   messagingSenderId: "349253517354",
//   appId: "1:349253517354:web:6f2357201d921edfa60353"
// };