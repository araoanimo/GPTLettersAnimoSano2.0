import firebase from "firebase/compat/app";
import "firebase/compat/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCg22xFbSorEoBgQKURZIMXnxCNv8bL4xQ",
    authDomain: "fir-gptletters.firebaseapp.com",
    projectId: "fir-gptletters",
    storageBucket: "fir-gptletters.appspot.com",
    messagingSenderId: "604449688887",
    appId: "1:604449688887:web:cb788c496626b33b045eb2",
    measurementId: "G-NQLCJDPW7D"
  };


firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();

export { auth, firebase };
